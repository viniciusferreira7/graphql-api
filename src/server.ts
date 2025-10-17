import { ApolloServer } from '@apollo/server';
import {
	fastifyApolloDrainPlugin,
	fastifyApolloHandler,
} from '@as-integrations/fastify';
import { buildSchema } from 'drizzle-graphql';
import { app } from './app';
import { db } from './db/client';
import { env } from './env';

async function start() {
	const { schema } = buildSchema(db);

	const apollo = new ApolloServer({
		schema,
		plugins: [fastifyApolloDrainPlugin(app)],
	});
	await apollo.start();

	app.route({
		url: '/graphql',
		method: ['POST', 'GET', 'OPTIONS'],
		handler: fastifyApolloHandler(apollo),
	});

	await app
		.listen({
			port: env.PORT,
			host: env.NODE_ENV !== 'production' ? '' : '0.0.0.0',
		})
		.then(() => console.log('🚀 HTTP server listening on port'));
}

start().catch(console.error);
