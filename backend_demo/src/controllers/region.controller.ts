import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Region} from '../models';
import {RegionRepository} from '../repositories';

export class RegionController {
  constructor(
    @repository(RegionRepository)
    public regionRepository : RegionRepository,
  ) {}

  @post('/regions')
  @response(200, {
    description: 'Region model instance',
    content: {'application/json': {schema: getModelSchemaRef(Region)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Region, {
            title: 'NewRegion',
            
          }),
        },
      },
    })
    region: Region,
  ): Promise<Region> {
    return this.regionRepository.create(region);
  }

  @get('/regions/count')
  @response(200, {
    description: 'Region model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Region) where?: Where<Region>,
  ): Promise<Count> {
    return this.regionRepository.count(where);
  }

  @get('/regions')
  @response(200, {
    description: 'Array of Region model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Region, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Region) filter?: Filter<Region>,
  ): Promise<Region[]> {
    return this.regionRepository.find(filter);
  }

  @patch('/regions')
  @response(200, {
    description: 'Region PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Region, {partial: true}),
        },
      },
    })
    region: Region,
    @param.where(Region) where?: Where<Region>,
  ): Promise<Count> {
    return this.regionRepository.updateAll(region, where);
  }

  @get('/regions/{id}')
  @response(200, {
    description: 'Region model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Region, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Region, {exclude: 'where'}) filter?: FilterExcludingWhere<Region>
  ): Promise<Region> {
    return this.regionRepository.findById(id, filter);
  }

  @patch('/regions/{id}')
  @response(204, {
    description: 'Region PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Region, {partial: true}),
        },
      },
    })
    region: Region,
  ): Promise<void> {
    await this.regionRepository.updateById(id, region);
  }

  @put('/regions/{id}')
  @response(204, {
    description: 'Region PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() region: Region,
  ): Promise<void> {
    await this.regionRepository.replaceById(id, region);
  }

  @del('/regions/{id}')
  @response(204, {
    description: 'Region DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.regionRepository.deleteById(id);
  }
}
