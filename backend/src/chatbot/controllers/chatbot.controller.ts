import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatbotService } from '../services/chatbot.service';
import { ChatMessageDto } from '../dto/chat-message.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  /**
   * Público: el widget flotante puede usarse sin sesión iniciada,
   * pero si hay un usuario autenticado, personaliza respuestas
   * (ej. estado de sus pedidos/reservas).
   */
  @Public()
  @ApiBearerAuth()
  @Post('message')
  handleMessage(
    @Body() dto: ChatMessageDto,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    return this.chatbotService.handleMessage(dto.message, user?.id);
  }
}
