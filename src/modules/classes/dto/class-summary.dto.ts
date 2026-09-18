import { Exclude, Expose } from 'class-transformer';
import { classContent, contentElementOptions, contentElements } from '../../../generated/prisma/client';

@Exclude()
export class ClassSummaryDto {
    constructor(partial: Partial<ClassSummaryDto>) {
        Object.assign(this, partial);
    }

    @Expose()
    id!: number;

    @Expose()
    name!: string;

    @Expose()
    description?: string | null;

    @Expose()
    appearance?: string | null;

    @Expose()
    hit_points!: number;

    @Expose()
    created_at!: Date;

    alignments?: any[];

    races?: any[];
    
    equipment?: any[];
    
    initialMoves?: any[];
    
    advancedMoves?: any[];
}