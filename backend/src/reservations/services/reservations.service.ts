import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from '../entities/reservation.entity';
import { CreateReservationDto } from '../dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
  ) {}

  async create(userId: string, dto: CreateReservationDto): Promise<Reservation> {
    const reservation = this.reservationsRepository.create({
      ...dto,
      userId,
      status: ReservationStatus.PENDIENTE,
    });
    return this.reservationsRepository.save(reservation);
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationsRepository.find({ order: { eventDate: 'ASC' } });
  }

  async findByUser(userId: string): Promise<Reservation[]> {
    return this.reservationsRepository.find({
      where: { userId },
      order: { eventDate: 'ASC' },
    });
  }

  async findById(id: string): Promise<Reservation> {
    const reservation = await this.reservationsRepository.findOne({ where: { id } });
    if (!reservation) {
      throw new NotFoundException('Reserva no encontrada');
    }
    return reservation;
  }

  async updateStatus(id: string, status: ReservationStatus): Promise<Reservation> {
    const reservation = await this.findById(id);
    reservation.status = status;
    return this.reservationsRepository.save(reservation);
  }

  async cancel(id: string, userId: string): Promise<Reservation> {
    const reservation = await this.findById(id);
    if (reservation.userId !== userId) {
      throw new NotFoundException('Reserva no encontrada');
    }
    reservation.status = ReservationStatus.CANCELADA;
    return this.reservationsRepository.save(reservation);
  }
}
