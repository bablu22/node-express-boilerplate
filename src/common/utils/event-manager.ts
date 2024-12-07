import EventEmitter from 'events';

class EventManager {
  private static instance: EventEmitter;

  constructor() {
    if (!EventManager.instance) {
      EventManager.instance = new EventEmitter();
    }
  }

  getInstance() {
    return EventManager.instance;
  }
}

export default EventManager;
