import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

/** Set req.user if valid token present; otherwise continue without req.user. */
const optionalProtectUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next();
  }
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (!error && data?.user) {
      req.user = { ...data.user };
    }
  } catch {
    // ignore invalid token
  }
  next();
};

export default optionalProtectUser;
