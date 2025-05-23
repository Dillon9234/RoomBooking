interface ISession {
  sessionId: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
}

export default ISession;
