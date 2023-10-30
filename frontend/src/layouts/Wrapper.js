import { useEffect, useState } from 'react';
import { setUser } from '../utils/auth';

const Wrapper = ({ children }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const handler = async () => {
      setLoading(true);
      await setUser();
      setLoading(false);
    };
    handler();
  }, []);

  return <>{loading ? null : children}</>;
};

export default Wrapper;
