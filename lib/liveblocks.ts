
import { Liveblocks } from "@liveblocks/node";

export const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
});

// sk_dev_95QZTGHjiSYi3zxisGr6fP5npYCEP3W9yoajfyGf9pf4Ses0bDFgcZQj7H5pdhAK