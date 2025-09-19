import { useEffect, useState, useCallback } from "react";

export default function useAsync(asyncFn, deps = []) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const run = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await asyncFn();
            setData(result);
            return result;
        } catch (e) {
            setError(e);
            throw e;
        } finally {
            setLoading(false);
        }
    }, deps); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        run();
    }, [run]);

    return { loading, error, data, reload: run, setData };
}
