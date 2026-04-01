import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, RequestStatus, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
// import { TelegramBotService } from 'src/telegram-bot/telegram-bot.service';
import { ClothesRequestService } from './clothes-request.service';
import { MaxBotService } from 'src/max-bot/max-bot.service';

const requestWithRelations =
  Prisma.validator<Prisma.ClothesRequestDefaultArgs>()({
    include: { participants: true, clothes: true, createdBy: true },
  });

// Генерируем тип

type ClothesRequestWithRelations = Prisma.ClothesRequestGetPayload<
  typeof requestWithRelations
>;

@Injectable()
export class ClothesRequestStatusService {
  constructor(
    private prisma: PrismaService,
    // private telegram: TelegramBotService,
    private maxBot: MaxBotService,

    private clothesRequestService: ClothesRequestService,
  ) {}

  async updateStatus(
    id: string,
    newStatus: RequestStatus,
    user: User,
    text: string,
  ) {
    const request = await this.prisma.clothesRequest.findUnique({
      where: { id },
      ...requestWithRelations,
    });

    if (!request) throw new NotFoundException();

    this.validateTransition(request.status, newStatus);
    await this.handleStatusEffects(request, newStatus, user, text);

    return this.prisma.clothesRequest.update({
      where: { id },
      data: { status: newStatus },
    });
  }

  private async handleStatusEffects(
    request: ClothesRequestWithRelations,
    nextStatus: RequestStatus,
    user: User,
    text?: string,
  ) {
    if (nextStatus === 'REJECTED' && (!text || text.trim().length === 0)) {
      throw new BadRequestException(
        'Причина отказа должна быть обязательно указана',
      );
    }

    let statusNote = '';
    switch (nextStatus) {
      case 'PENDING':
        statusNote = `🔃 Заявка отправлена на согласование \n\n🗂 Заявка: "${request.title}" \n\n👤 ${user.lastName} ${user.firstName}`;
        break;
      case 'APPROVED':
        statusNote = `✅ Заявка одобрена \n\n🗂 Заявка: "${request.title}" \n\n👤 ${user.lastName} ${user.firstName}`;
        break;
      case 'REJECTED':
        statusNote = `❌ Заявка отклонена \n\n🗂 Заявка: "${request.title}" \n\n👤 ${user.lastName} ${user.firstName} \n\n💬 Причина: `;
        break;
      case 'COMPLETED':
        statusNote = `✅ Заявка завершена \n\n🗂 Заявка: "${request.title}" \n\n👤 ${user.lastName} ${user.firstName}`;
        break;
      case 'IN_PROGRESS':
        statusNote = `🛠 Заявка взята в работу \n\n🗂 Заявка: "${request.title}" \n\n👤 ${user.lastName} ${user.firstName}`;
        break;
      case 'CLOSED':
        statusNote = '🔒 Заявка закрыта.\n\n';
        break;
    }

    const finalComment = text ? `${statusNote} ${text}` : statusNote;

    await this.clothesRequestService.addComment(
      request.id,
      finalComment,
      user,
      true,
    );

    switch (nextStatus) {
      case 'PENDING':
        return this.onSendToReview(request, finalComment);
      case 'APPROVED':
        return this.onApproved(request, finalComment);
      case 'COMPLETED':
        return this.onCompleted(request, finalComment);
      case 'REJECTED':
        return this.onRejected(request, finalComment);
      case 'IN_PROGRESS':
        return this.onProgress(request, finalComment);
      default:
        return;
    }
  }

  // 1. Уведомляем ВСЕХ участников (массив уже готов через .map)
  private async onSendToReview(
    request: ClothesRequestWithRelations,
    statusNote: string,
  ) {
    const phones = request.participants.map((p) => p.phone);
    await this.maxBot.sendBulkRequestNotifications(phones, statusNote);
  }

  // 2. Уведомляем только автора (оборачиваем телефон в массив [phone])
  private async onApproved(
    request: ClothesRequestWithRelations,
    statusNote: string,
  ) {
    const phones = request.participants.map((p) => p.phone);
    await this.maxBot.sendBulkRequestNotifications(phones, statusNote);
  }

  // 3. Уведомляем только автора
  private async onRejected(
    request: ClothesRequestWithRelations,
    statusNote: string,
  ) {
    const phones = request.participants.map((p) => p.phone);
    await this.maxBot.sendBulkRequestNotifications(phones, statusNote);
  }

  private async onProgress(
    request: ClothesRequestWithRelations,
    statusNote: string,
  ) {
    const phones = request.participants.map((p) => p.phone);
    await this.maxBot.sendBulkRequestNotifications(phones, statusNote);
  }

  // 4. Уведомляем автора (исправлен тип аргумента на Relations)
  private async onCompleted(
    request: ClothesRequestWithRelations,
    statusNote: string,
  ) {
    // Здесь будет логика списания со склада (this.warehouseService...)
    const phones = request.participants.map((p) => p.phone);
    await this.maxBot.sendBulkRequestNotifications(phones, statusNote);
  }

  private validateTransition(current: RequestStatus, next: RequestStatus) {
    const transitions: Record<RequestStatus, RequestStatus[]> = {
      CREATED: ['PENDING', 'CLOSED'],
      PENDING: ['APPROVED', 'REJECTED'],
      APPROVED: ['IN_PROGRESS', 'REJECTED'],
      IN_PROGRESS: ['COMPLETED'],
      REJECTED: ['PENDING', 'CLOSED'],
      COMPLETED: ['CLOSED'],
      CLOSED: [],
    };

    const allowed = transitions[current];
    if (!allowed || !allowed.includes(next)) {
      throw new Error(`Невозможный переход из ${current} в ${next}`);
    }
  }
}
