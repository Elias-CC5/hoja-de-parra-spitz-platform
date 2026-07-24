import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../entities/reservation.entity';
import { CreateReservationDto } from '../dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
  ) {}

  async create(userId: string, dto: CreateReservationDto): Promise<Reservation> {
    const newReservation = this.reservationsRepository.create({
      ...(dto as any),
      user: { id: userId },
    } as Partial<Reservation>);

    return await this.reservationsRepository.save(newReservation);
  }

  async findByUser(userId: string): Promise<Reservation[]> {
    return await this.reservationsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Reservation> {
    const reservation = await this.reservationsRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!reservation) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }

    return reservation;
  }

  async cancel(id: string, userId: string): Promise<Reservation> {
    const reservation = await this.findById(id);

    if (reservation.user?.id !== userId) {
      throw new NotFoundException('No tienes permiso para cancelar esta reserva');
    }

    (reservation as any).status = 'CANCELADO';
    return await this.reservationsRepository.save(reservation);
  }

  async findAll(): Promise<Reservation[]> {
    return await this.reservationsRepository.find({
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, status: any): Promise<Reservation> {
    const reservation = await this.findById(id);
    (reservation as any).status = status;
    return await this.reservationsRepository.save(reservation);
  }
}