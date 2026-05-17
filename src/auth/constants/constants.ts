import 'dotenv/config';

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error('JWT_SECRET não definido no .env');

export const jwtConstants = { secret };
