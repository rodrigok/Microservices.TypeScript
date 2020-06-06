import { IAuthorization } from '../../definition/IAuthorization';
import { proxify } from './proxify';


export const Authorization = proxify<IAuthorization>();
