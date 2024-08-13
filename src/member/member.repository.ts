import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/member/entity/member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LectureRepository {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {}
}
