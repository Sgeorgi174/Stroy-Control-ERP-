import { Controller } from '@nestjs/common';
import { ToolHistoryService } from './tool-history.service';

@Controller('tool-history')
export class ToolHistoryController {
  constructor(private readonly toolHistoryService: ToolHistoryService) {}
}
