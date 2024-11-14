import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entity/course.entity';
import { Brackets, Repository, UpdateResult } from 'typeorm';
import { CourseDto } from './dto/course.dto';
import * as moment from 'moment';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseRepository {
  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,
  ) {}

  /* 강좌 개설 */
  async createCourse(userId: number, courseDto: CourseDto): Promise<Course> {
    const {
      courseTitle,
      courseDays,
      courseStartTime,
      courseEndTime,
      courseCapacity,
      courseColor,
    } = courseDto;

    const course = this.courseRepository.create({
      courseTitle,
      courseDays,
      courseStartTime,
      courseEndTime,
      courseCapacity,
      courseColor,
      user: { userId },
    });
    await this.courseRepository.save(course);

    return course;
  }

  /* 강좌 상세 정보 */
  async findCourseDetail(courseId: number): Promise<Course> {
    return await this.courseRepository.findOne({
      where: { courseId },
      relations: ['user', 'member', 'member.user', 'lecture'],
    });
  }

  /* 모든 강좌 조회 */
  async findAllCourses(): Promise<Course[]> {
    return await this.courseRepository.find({
      where: { courseDeletedAt: null },
    });
  }

  /* 달력에 맞춰 강좌 조회(instructor) */
  async findAllCoursesForScheduleByInstructor(
    userId: number,
  ): Promise<Course[]> {
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

    return await this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.user', 'user')
      .leftJoinAndSelect(
        'course.lecture',
        'lecture',
        'lecture.lectureDate BETWEEN :startOfMonth AND :endOfMonth',
        { startOfMonth, endOfMonth },
      )
      .leftJoinAndSelect('lecture.user', 'lectureUser')
      .leftJoinAndSelect('lectureUser.customer', 'customer')
      .where('course.userId = :userId', { userId })
      .getMany();
  }

  /* 달력에 맞춰 강좌 조회(customer) */
  async findAllCoursesForScheduleByCustomer(userId: number): Promise<Course[]> {
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

    return await this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.user', 'user')
      .leftJoinAndSelect(
        'course.lecture',
        'lecture',
        'lecture.lectureDate BETWEEN :startOfMonth AND :endOfMonth',
        { startOfMonth, endOfMonth },
      )
      .leftJoinAndSelect('lecture.user', 'lectureUser')
      .leftJoinAndSelect('lectureUser.customer', 'customer')
      .leftJoinAndSelect('course.member', 'member')
      .leftJoinAndSelect('member.user', 'memberUser')
      .where('memberUser.userId = :userId', { userId })
      .getMany();
  }

  /* 겹치는 시간대 강좌 확인 */
  async findOverlappingCourse(
    userId: number,
    courseDto: CourseDto,
  ): Promise<Course> {
    const { courseDays, courseStartTime, courseEndTime } = courseDto;

    const daysArray = courseDays.includes(',')
      ? courseDays.split(',')
      : [courseDays];

    const query = this.courseRepository
      .createQueryBuilder('course')
      .where('course.userId = :userId', { userId });

    query.andWhere(
      new Brackets((qb) => {
        daysArray.forEach((day, index) => {
          qb.orWhere(
            `(course.courseDays LIKE :day${index} AND NOT (course.courseEndTime <= :courseStartTime OR course.courseStartTime >= :courseEndTime))`,
            {
              [`day${index}`]: `%${day}%`,
              courseStartTime,
              courseEndTime,
            },
          );
        });
      }),
    );

    return await query.getOne();
  }

  /* 강좌 수정 */
  async updateCourse(
    courseId: number,
    updateCourseDto: UpdateCourseDto,
  ): Promise<UpdateResult> {
    return await this.courseRepository.update(courseId, updateCourseDto);
  }
}
