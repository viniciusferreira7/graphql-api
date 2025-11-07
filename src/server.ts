import { app } from './app';
import { env } from './env';
import { apolloServer } from './lib/apolo';

async function start() {
	await apolloServer(app);

	await app
		.listen({
			port: env.PORT,
			host: env.NODE_ENV !== 'production' ? '' : '0.0.0.0',
		})
		.then(() => console.log('🚀  HTTP server listening on port'));
}

start().catch(console.error);
