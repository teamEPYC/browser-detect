import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("detect", "routes/detect.tsx")
] satisfies RouteConfig;
