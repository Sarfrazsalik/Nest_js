import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class DatabaseService extends prismaClient implements OnModuleInit {}
