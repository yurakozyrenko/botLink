export enum UserActions {
  START = '/start',
  SAVE = '/save',
  LIST = '/list',
  GET = '/get',
  DELETE = '/delete',
}

export enum UserState {
  START = 'start',
  WAITING_FOR_APPROVE_SAVE = 'waitingForApproveSave',
  WAITING_FOR_APPROVE_DELETE = 'waitingForApproveDelete',
  WAITING_FOR_APPROVE_GET = 'waitingForApproveGet',
}

export const messages = {
  START: 'Привет! Добро пожаловать в нашего бота хранения ссылок',
  MENU_SELECTION: 'Пожалуйста, выберите из меню:',
  SAVE: 'Введите ссылку которую хотите сохранить:',
  SAVE_ERR: 'Ошибка при сохранении ссылки',
  SAVE_SUCCESSFULLY: 'Ссылка успешно сохранена.',
  LIST: 'Список сохраненных ссылок:',
  LIST_EMPTY: 'У вас пока нет сохраненных ссылок.',
  GET: 'Введите код для получения ссылки:',
  GET_ERR: 'Ошибка при получении ссылки',
  DELETE: 'Введите код ссылки которую хотите удалить:',
  DELETE_ERR: 'Ошибка при удалении ссылки',
  DELETE_SUCCESSFULLY: 'Ссылка успешно удалена',
  NOT_A_LINK: 'Ввели невалидный url! Попробуйте заново.',
  DEFAULT: 'Привет, я умею хранить ссылки.',
  GET_EMPTY: 'Ссылка не найдена',
};
