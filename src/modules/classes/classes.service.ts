import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { PrismaService } from '../../database/prisma/prisma.service';
import { ClassResponseDto } from './dto/class-response.dto';
import { ClassSummaryDto } from './dto/class-summary.dto';
import { ClassMapper } from './mappers/class.mapper';
import { ClassDetailDto } from './dto/class-detail.dto';

@Injectable()
export class ClassesService {
  constructor(private prismaService: PrismaService) {}

  create(createClassDto: CreateClassDto) {
    return 'This action adds a new class';
  }

  async findAll() : Promise<ClassResponseDto[] | []> {
    const classes = await this.prismaService.classes.findMany(
      {
        select: {
          id: true,
          name: true,
          damageDice: true,
          baseLoad: true,
        },
        orderBy: {
          id: 'asc',
        },
      },
    );

    const response = classes.map((classData) => new ClassResponseDto(classData));

    return response;
  }

  async findOne(id: number) : Promise<ClassDetailDto | null> {
    const classData = await this.prismaService.classes.findUniqueOrThrow({
      where: { id },
      include: {
        contents: {
          include: {
            contentElements: {
              include: {
                contentElementOptions: true,
              },
            },
          },
        },
      },
    });

    return ClassMapper.toDetail(classData);
  }

  update(id: number, updateClassDto: UpdateClassDto) {
    return `This action updates a #${id} class`;
  }

  remove(id: number) {
    return `This action removes a #${id} class`;
  }
}
