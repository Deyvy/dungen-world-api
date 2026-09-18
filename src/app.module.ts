import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma/prisma.module';
import { ClassesModule } from './modules/classes/classes.module';
import { CharacterModule } from './modules/character/character.module';
import { SpellsModule } from './modules/spells/spells.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [PrismaModule, ClassesModule, CharacterModule, SpellsModule, UsersModule],
  controllers: [],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ClassSerializerInterceptor
    }
  ],
})
export class AppModule {}
