import { ConversationMiddleware } from './conversation.middleware';

describe('ConversationMiddleware', () => {
  it('should be defined', () => {
    expect(new ConversationMiddleware()).toBeDefined();
  });
});
