export default interface HoleModel {
    courseID: number;
    number: number;
    par: number;
    name?: string | null;
    optional?: boolean | false;
}