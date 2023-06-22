interface IProps {
    backgroundColor?: string;
    successColor?: string;
    errorColor?: string;
    obj: any;
}
interface ILogValueProps {
    color: string;
    title?: string;
    value: any;
}
export default class ConsoleHelper {
    
    static log(props: IProps)
    {
        props.backgroundColor = props.backgroundColor || "#000";
        props.successColor = props.successColor || "green";
        props.errorColor = props.errorColor || "red";

        console.log("");
        console.log('%c ' + props.obj, `background: ${props.obj ? props.successColor : props.errorColor}; color: #fff`);
        console.log(props.obj)
    }
    static log_value(props: ILogValueProps)
    {
        console.log("");
        console.log('%c ' + props.title + ": " + props.value, `background: ${props.color}; color: #fff`);
        if(props.value != null)
        {
            console.log(props.value);
        }
    }
}   