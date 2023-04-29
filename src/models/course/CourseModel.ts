import HoleModel from "../hole/HoleModel";

export default interface CourseModel{
    ID: number;
    name: string;
    description: string;
    image: string;
    holes: HoleModel[];
}