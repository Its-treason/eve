import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react";

type QueryParamsData = {
  queryParams: ReadonlyURLSearchParams,
  updateParam: (name: string, value: string) => void,
}

export default function useQueryParams(): QueryParamsData {
  const router = useRouter();
  const pathname = usePathname();
  const queryParams = useSearchParams()!;

  const updateParam = useCallback((name: string, value: string) => {
    const params = new URLSearchParams(queryParams.toString());
    params.set(name, value)
    router.push(pathname + '?' + params.toString());
  }, [queryParams])

  return { queryParams, updateParam };
}
