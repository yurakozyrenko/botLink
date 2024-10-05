export enum UserActions {
  START = '/start',
  SAVE = '/save',
  LIST = '/list',
  GET = '/get',
  DELETE = '/delete',
}

export enum UserState {
  START = 'start',
  WAITING_FOR_APPROVE = 'waitingForApprove',
  CONFIRM = 'confirm',
}

export const messages = {
  START: 'Привет! Добро пожаловать в нашего бота хранения ссылок! ',
  MENU_SELECTION: 'Пожалуйста, выберите из меню: ',
  MENU_CANSEL: 'Отписаться от уведомлений',
  SAVE: 'Введите ссылку которую хотите сохранить',
  LIST: 'Список сохраненных ссылок',
  GET: 'Получить ссылку',
  DELETE: 'Удалить ссылку',
  NOT_A_LINK: 'Ввели невалидный url! Попробуйте еще раз.',

  CITY_SELECTION: 'Пожалуйста, введите название вашего города: ',
  TIME_SELECTION: 'Выберите время для ежедневной рассылки: ',
  ALREADY_SAVED: 'Ваши данные приняты.',
  DELETED_SUCCESSFULLY: 'Удаление прошло успешно',
  DEFAULT: 'Привет, я умею хранить ссылки.',
};
