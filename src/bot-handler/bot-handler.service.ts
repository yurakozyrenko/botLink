import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import delay from '../utils/delay';

import { BotService } from '../bot/bot.service';
import { User } from '../users/entity/users.entity';
import { UserActions, UserState, messages } from '../users/users.constants';
import { UsersService } from '../users/users.service';
import { TUsersActions } from '../users/users.types';

@Injectable()
export class BotHandlersService {
  private readonly logger: LoggerService = new Logger(BotHandlersService.name);
  private userActions: TUsersActions;
  private readonly apiKey: string;
  private readonly chatId: number;

  constructor(
    private readonly botService: BotService,
    private readonly usersService: UsersService,
    private readonly httpService: HttpService,
    private configService: ConfigService
  ) {}

  async onModuleInit() {
    this.userActions = {
      [UserActions.START]: async (text, user) => this.handleStart(text, user), //старт
      [UserActions.SAVE]: async (text, user) => this.handleSave(text, user), //Сохранение ссылки
      [UserActions.LIST]: async (text, user) => this.handleList(text, user), //Список сохраненных ссылок
      [UserActions.GET]: async (text, user) => this.handleGet(text, user), //Получение ссылки
      [UserActions.DELETE]: async (text, user) => this.handleDelete(text, user), //Удаление ссылки
    };
  }

  async handleTextMessage(text: string, user: User): Promise<void> {
    this.logger.log('run handleTextMessage');

    const { userState } = user;

    if (userState === UserState.WAITING_FOR_APPROVE) {
      return this.waitingForApproveAction(text, user);
    }

    const actionHandler = this.userActions[text as UserActions];

    console.log('actionHandler: ', actionHandler);

    if (!actionHandler) {
      return this.handleDefault(text, user.chatId);
    }

    return actionHandler(text, user);
  }

  async handleStart(text: string, { id, chatId }: User) {
    this.logger.log('run handleStart');

    await this.botService.sendMessage(chatId, messages.START);
    await this.usersService.updateUser(chatId, { userState: UserState.START });
    await delay();
    const message = `${messages.MENU_SELECTION}`;
    await this.botService.sendMessage(chatId, message);
  }

  async handleSave(text: string, { id, chatId }: User): Promise<void> {
    this.logger.log('run handleSave');

    await this.botService.sendMessage(chatId, messages.SAVE);
    await this.usersService.updateUser(chatId, {
      userState: UserState.WAITING_FOR_APPROVE,
    });
  }

  async handleList(text: string, { chatId }: User): Promise<void> {}

  async handleGet(text: string, { chatId }: User): Promise<void> {}

  async handleDelete(text: string, { chatId }: User): Promise<void> {}

  async handleDefault(text: string, chatId: number): Promise<void> {
    this.logger.log('run Default ');

    await this.botService.sendMessage(chatId, messages.DEFAULT);

    this.logger.log('Default successfully ended');
  }

  async waitingForApproveAction(
    text: string,
    { id, chatId }: User
  ): Promise<void> {
    this.logger.log('run waitingForApproveAction');

    // Проверяем, что текст является корректной ссылкой
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const url = text.match(urlRegex);

    if (!url) {
      await this.botService.sendMessage(
        chatId,
        'Пожалуйста, введите корректную ссылку.'
      );
      return;
    }

    await this.usersService.updateUser(chatId, { userState: UserState.START });

    // try {
    //   // Сохранение ссылки в базу данных
    //   await this.usersService.saveUserLink(chatId, url[0]);

    //   // Отправляем пользователю сообщение о том, что ссылка сохранена
    //   await this.botService.sendMessage(chatId, 'Ссылка успешно сохранена!');
    // } catch (error) {
    //   this.logger.error('Ошибка при сохранении ссылки', error);

    //   // Если произошла ошибка, отправляем сообщение об ошибке
    //   await this.botService.sendMessage(
    //     chatId,
    //     'Произошла ошибка при сохранении ссылки.'
    //   );
    // }

    this.logger.log('waitingForApproveAction successfully ended');
  }
}
