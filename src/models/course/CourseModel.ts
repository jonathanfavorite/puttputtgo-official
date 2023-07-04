import HoleModel from "../hole/HoleModel";
import CourseStatsModel from "./CourseStatsModel";

export default interface CourseModel{
    ID: number;
    name: string;
    description: string;
    image: string;
    holes: HoleModel[];
    stats: CourseStatsModel;
}