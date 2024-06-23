import { PaginatedData, PaginationInfo } from "./interfaces";

type PaginatorConfig<ReturnType> ={data:ReturnType[],count:number,page:number,limit:number}


export class Paginator{
    paginate<ReturnType>({data,count,page,limit}:PaginatorConfig<ReturnType>):PaginatedData<ReturnType[]>{
        const totalPages = Math.ceil(count / limit);
         // Calcular la página basada en el page y el límite
         //const page = Math.floor(page / limit) + 1;
       

        let paginationInfo: PaginationInfo = {
           page: page,
           perPage: limit,
           totalPages: totalPages,
           totalElements: count,
           nextPage: page < totalPages ? page + 1 : null,
           prevPage: page > 1 ? page - 1 : null,
         };
       
        return { data: data, pagination: paginationInfo };
    
      }
}