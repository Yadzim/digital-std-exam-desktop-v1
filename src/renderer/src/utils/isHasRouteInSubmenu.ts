import { RoutesTypeSubmenu } from '../routes/types';

const isHasRouteInSubmenu = (element: Array<RoutesTypeSubmenu>, path: string) => {
    if (Array.isArray(element) && element.length) {
        const route = element.filter(e => e.path === path)
        return route.length > 0
    } else {
        return false;
    }
}


export default isHasRouteInSubmenu;