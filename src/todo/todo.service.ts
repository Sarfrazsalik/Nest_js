import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client/edge';

@Injectable()
export class TodoService {
  constructor(private readonly databaseService:DatabaseService){ }


  async create(createTodoDto: CreateTodoDto, userEmail: string) {
    try {
      const user = await this.databaseService.user.findFirst({ 
        where: { 
          email : userEmail
        }
       })
      if (!user) {
        throw new Error('User not found');
      }
      let data: Prisma.TodoCreateInput = {
        task: createTodoDto.task,
        description: createTodoDto.description,
        status: 'ACTIVE',
        user: {
          connect: { email: user.email },
        },
      };
      return this.databaseService.todo.create({ data });
    } catch (err) {
      throw new Error(`Error creating todo: ${err.message}`);
    }
  }
  
async findAll(userEmail: string) {
  return this.databaseService.todo.findMany({
    where: {
        userEmail: userEmail,
      }
  });
}

  async findOne(id: number) {
    return this.databaseService.todo.findFirst({
      where:{
        id:id
      }
    })
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    return this.databaseService.todo.update({
      where:{
        id:id
      },
      data: updateTodoDto
    });
  }

  async remove(id: number) {
    return this.databaseService.todo.delete({
      where:{
        id:id
      }
    });
  }
}
