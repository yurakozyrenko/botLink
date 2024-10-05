import { Injectable, Logger, LoggerService } from '@nestjs/common';

import { BotService } from '../bot/bot.service';
import { CreateLinkDto } from '../links/dto/createLink.dto';
import { LinksService } from '../links/links.service';
import { User } from '../users/entity/users.entity';
import { UserActions, UserState, messages } from '../users/users.constants';
import { UsersService } from '../users/users.service';
import { TUsersActions } from '../users/users.types';
import delay from '../utils/delay';

@Injectable()
export class BotHandlersService {
  private readonly logger: LoggerService = new Logger(BotHandlersService.name);
  private userActions: TUsersActions;

  constructor(
    private readonly botService: BotService,
    private readonly usersService: UsersService,
    private readonly linksService: LinksService,
  ) {}

  async onModuleInit() {
    this.userActions = {
      [UserActions.START]: async (text, user) => this.handleStart(text, user),
      [UserActions.SAVE]: async (text, user) => this.handleSave(text, user),
      [UserActions.LIST]: async (text, user) => this.handleList(text, user),
      [UserActions.GET]: async (text, user) => this.handleGet(text, user),
      [UserActions.DELETE]: async (text, user) => this.handleDelete(text, user),
    };
  }

  async handleTextMessage(text: string, user: User): Promise<void> {
    this.logger.log('run handleTextMessage');

    const { userState } = user;

    if (userState === UserState.WAITING_FOR_APPROVE_SAVE) {
      return this.waitingForApproveActionSave(text, user);
    }

    if (userState === UserState.WAITING_FOR_APPROVE_DELETE) {
      return this.waitingForApproveActionDelete(text, user);
    }

    if (userState === UserState.WAITING_FOR_APPROVE_GET) {
      return this.waitingForApproveActionGet(text, user);
    }

    const actionHandler = this.userActions[text as UserActions];

    if (!actionHandler) {
      return this.handleDefault(user.chatId);
    }

    return actionHandler(text, user);
  }

  async handleStart(text: string, { chatId }: User) {
    this.logger.log('run handleStart');

    await this.botService.sendMessage(chatId, messages.START);
    await this.usersService.updateUser(chatId, { userState: UserState.START });
    await delay();
    const message = `${messages.MENU_SELECTION}`;
    await this.botService.sendMessage(chatId, message);
  }

  async handleSave(text: string, { chatId }: User): Promise<void> {
    this.logger.log('run handleSave');

    await this.botService.sendMessage(chatId, messages.SAVE);
    await this.usersService.updateUser(chatId, {
      userState: UserState.WAITING_FOR_APPROVE_SAVE,
    });
  }

  async handleList(text: string, { id, chatId }: User): Promise<void> {
    this.logger.log('run handleList');

    const userLinks = await this.linksService.getLinksByUserId(id);

    if (userLinks.length > 0) {
      const message = userLinks.map((link, i) => `${++i}. код: ${link.id}, ссылка: ${link.userUrl}`).join('\n');

      await this.botService.sendMessage(chatId, `${messages.LIST}\n${message}`);
    } else {
      await this.botService.sendMessage(chatId, messages.LISTEMPTY);
    }
  }

  async handleGet(text: string, { chatId }: User): Promise<void> {
    this.logger.log('run handleGet');

    await this.botService.sendMessage(chatId, messages.GET);
    await this.usersService.updateUser(chatId, {
      userState: UserState.WAITING_FOR_APPROVE_GET,
    });
  }

  async handleDelete(text: string, { chatId }: User): Promise<void> {
    this.logger.log('run handleDelete');

    await this.botService.sendMessage(chatId, messages.DELETE);
    await this.usersService.updateUser(chatId, {
      userState: UserState.WAITING_FOR_APPROVE_DELETE,
    });
  }

  async handleDefault(chatId: number): Promise<void> {
    this.logger.log('run Default ');

    await this.botService.sendMessage(chatId, messages.DEFAULT);

    this.logger.log('Default successfully ended');
  }

  async waitingForApproveActionSave(text: string, { id, chatId }: User): Promise<void> {
    this.logger.log('run waitingForApproveActionSave');

    const isLink = this.isValidLink(text);

    if (!isLink) {
      return await this.botService.sendMessage(chatId, messages.NOT_A_LINK);
    }

    const createLinkDto: CreateLinkDto = { userUrl: text, userId: id };

    try {
      await this.linksService.createUserLink(createLinkDto);
      await this.botService.sendMessage(chatId, messages.SAVE_SUCCESSFULLY);
    } catch (error) {
      this.logger.error(messages.SAVE_ERR, error);
      await this.botService.sendMessage(chatId, messages.SAVE_ERR);
    }

    await this.usersService.updateUser(chatId, { userState: UserState.START });
    this.logger.log('waitingForApproveActionSave successfully ended');
  }

  async waitingForApproveActionGet(text: string, { chatId }: User): Promise<void> {
    this.logger.log('run waitingForApproveActionGet');

    try {
      const link = await this.linksService.getLinkById(text);
      await this.botService.sendMessage(chatId, link.userUrl);
    } catch (error) {
      this.logger.error(messages.GET_ERR, error);
      await this.botService.sendMessage(chatId, messages.GET_ERR);
    }

    await this.usersService.updateUser(chatId, { userState: UserState.START });
    this.logger.log('waitingForApproveActionGet successfully ended');
  }

  async waitingForApproveActionDelete(text: string, { chatId }: User): Promise<void> {
    this.logger.log('run waitingForApproveActionDelete');

    try {
      await this.linksService.deleteLinkById(text);

      await this.botService.sendMessage(chatId, messages.DELETE_SUCCESSFULLY);
    } catch (error) {
      this.logger.error(messages.DELETE_ERR, error);
      await this.botService.sendMessage(chatId, messages.DELETE_ERR);
    }

    await this.usersService.updateUser(chatId, { userState: UserState.START });
    this.logger.log('waitingForApproveActionDelete successfully ended');
  }

  private isValidLink(text: string): boolean {
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;
    return urlRegex.test(text);
  }
}
