import { useLocation, useNavigate } from 'react-router-dom';

export function useUrlQueryParam<TParam extends string = string>(
  name: string,
  defaultValue?: TParam
): [TParam | undefined, (value: TParam | undefined) => void] {
  const location = useLocation();
  const navigate = useNavigate();

  const getUpdatedSearchParams = (param: string, value: string | undefined) => {
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set(param, value); // Update the param
    } else {
      params.delete(param); // Remove the param if value is undefined
    }

    return params;
  };

  function set(value: string | undefined) {
    const updatedParams = getUpdatedSearchParams(name, value);
    navigate(`${location.pathname}?${updatedParams.toString()}`);
  }

  function get(): TParam | undefined {
    const params = new URLSearchParams(location.search);
    const value = params.get(name);
    return value ? (value as TParam) : undefined;
  }

  return [get() || defaultValue, set];
}
