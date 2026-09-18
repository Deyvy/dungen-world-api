import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import "dotenv/config";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        const adapter = new PrismaMariaDb({
            host: process.env.HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE
        });

        super({
            adapter,
        });
    }
    async onModuleInit() {
        await this.$connect();
    }
}
