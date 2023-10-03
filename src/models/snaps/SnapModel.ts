export default interface SnapModel {
    id: string;
    filename: string;
    processed: boolean;
    tmp_thumb?: string;
    failure: boolean;
    type?: number;
}