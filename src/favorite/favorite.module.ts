import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StudioModule } from '../studio/studio.module'
import { UserModule } from '../users/user.module'
import { Favorite } from './favorite.entity'
import { FavoritesController } from './favorites.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite]),
    UserModule,
    StudioModule,
  ],
  controllers: [FavoritesController],
  exports: []
})
export class FavoriteModule {}
