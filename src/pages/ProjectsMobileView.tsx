import { useLocation } from "react-router-dom"

const ProjectsMobileView = () => {
    const location = useLocation();

    // Extract token from URL
    let token: string | null = null;
    const searchParams = new URLSearchParams(location.search);
    token = searchParams.get('token') || searchParams.get('access_token');
    if (!token && location.hash) {
        const hash = location.hash.replace(/^#/, '');
        const hashParams = new URLSearchParams(hash);
        token = hashParams.get('token') || hashParams.get('access_token');
    }

    // Store token and clean URL
    if (token) {
        localStorage.setItem('token', token);

        try {
            const url = new URL(window.location.href);

            if (url.hash) {
                const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''));
                let changed = false;
                if (hashParams.has('token')) { hashParams.delete('token'); changed = true; }
                if (hashParams.has('access_token')) { hashParams.delete('access_token'); changed = true; }
                url.hash = changed ? (hashParams.toString() ? `#${hashParams.toString()}` : '') : url.hash;
            }

            window.history.replaceState({}, '', url.toString());
        } catch (e) {
            const clean = window.location.pathname + window.location.hash;
            window.history.replaceState({}, '', clean);
        }
    }

    return (
        <div>ProjectsMobileView - Token: {token}</div>
    )
}

export default ProjectsMobileView