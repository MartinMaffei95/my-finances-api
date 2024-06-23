import { Injectable, Logger } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { handleDBExceptions } from 'src/common/error.handler';
import { CategoriesFiltersDto } from './dto/filters.dto';
import { Paginator } from 'src/common/Paginator.service';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);
  private readonly paginator = new Paginator();


  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const { parent:parendId,...categoryData } = createCategoryDto;
    
      let parent =null
      if(parendId){
        parent = await this.categoryRepository.findOneBy({ id: parendId });
        if (!parent) {
         throw {code:"NOT_FOUND",detail:`Category ${parendId} not found`}
        }
      }


      const category = this.categoryRepository.create({
        ...categoryData,
        parent
      });

      await this.categoryRepository.save(category)
      return category
    } catch (error) {
      handleDBExceptions(this.logger,error)
    }
  }

  async findAll(query:CategoriesFiltersDto) {
    try {
      const { limit = 10, page = 1, search = '', order="ASC",order_type="id",name="" } = query;

      const categoryQuery = this.categoryRepository.createQueryBuilder("categories")
      .leftJoinAndSelect("categories.parent", "parent")
      .leftJoinAndSelect("categories.children", "children")
      .where("LOWER(categories.name) LIKE :name", { name: `%${search.toLowerCase()}%` })
      .andWhere("parent.id IS NULL"); // Solo obtén las categorías que son padres

      if (name?.length > 0) {
        categoryQuery.andWhere("categories.name = :name", { name });
      }
      // Adding order and page
      categoryQuery.orderBy(`categories.${order_type}`, order)
      .take(limit)
      .skip((page - 1) * limit)
      
      //Execute the query
      const categoriesQuery = await categoryQuery.getManyAndCount()
      // DETRUCTURATE
      const [categories,count]= categoriesQuery
      const categoriesResponse = this.paginator.paginate(
        {data:categories,count,limit,page}
      )
      return categoriesResponse

    } catch (error) {
      handleDBExceptions(this.logger,error)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
