export default function ItemIcon({ fileType = 0, fileName }) {
    if (fileType === 1) {
        return <Icon className="fa-solid fa-folder" />;
    }
    if(fileType === 2) {
        return <Icon className="fa-solid fa-folder-tree" />;
    }

    const EXTENSION = fileName.split(".").pop();

    // Define common classes
    const imageIconClass = 'fas fa-image';
    const codeIconClass = 'fas fa-file-code';
    const fileArchiveIconClass = 'fas fa-file-archive';
    const fileAudioIconClass = 'fas fa-file-audio';
    const fileVideoIconClass = 'fas fa-file-video';
    const fileWordIconClass = 'fas fa-file-word';
    const fileExcelIconClass = 'fas fa-file-excel';
    const filePowerPointIconClass = 'fas fa-file-powerpoint';

    const MIME = {
        "ico": imageIconClass,
        "gif": imageIconClass,
        "jpg": imageIconClass,
        "jpeg": imageIconClass,
        "png": imageIconClass,
        "bmp": imageIconClass,
        "svg": imageIconClass,
        "webp": imageIconClass,
        "avif": imageIconClass,
        "tiff": imageIconClass,
        "eps": imageIconClass,
        "raw": imageIconClass,
        "indd": imageIconClass,
        "ai": imageIconClass,
        "pdf": "fas fa-file-pdf",
        "psd": "fas fa-file-image",
        "svgz": imageIconClass,
        "webm": "fas fa-file-video",
        "tga": imageIconClass,
        "css": "fab fa-css3-alt",
        "scss": "fab fa-sass",
        "sass": "fab fa-sass",
        "less": "fab fa-less",
        "html": "fab fa-html5",
        "xml": codeIconClass,
        "rss": codeIconClass,
        "yaml": codeIconClass,
        "yml": codeIconClass,
        "toml": codeIconClass,
        "bat": codeIconClass,
        "vb": codeIconClass,
        "asp": codeIconClass,
        "aspx": codeIconClass,
        "jsp": codeIconClass,
        "erb": codeIconClass,
        "jsx": codeIconClass,
        "coffee": "fas fa-coffee",
        "handlebars": codeIconClass,
        "swift": codeIconClass,
        "scala": codeIconClass,
        "rust": codeIconClass,
        "dart": codeIconClass,
        "go": codeIconClass,
        "kotlin": codeIconClass,
        "groovy": codeIconClass,
        "vbnet": codeIconClass,
        "clojure": codeIconClass,
        "lua": codeIconClass,
        "matlab": codeIconClass,
        "fortran": codeIconClass,
        "powershell": codeIconClass,
        "r": codeIconClass,
        "elixir": codeIconClass,
        "csv": "fas fa-file-csv",
        "tsv": "fas fa-file-csv",
        "rtf": "fas fa-file-alt",
        "ods": "fas fa-file-excel",
        "odt": "fas fa-file-word",
        "md": "fas fa-file-alt",
        "markdown": "fas fa-file-alt",
        "txt": "fas fa-file-alt",
        "log": "fas fa-file-alt",
        "htaccess": codeIconClass,
        "php": "fab fa-php",
        "java": "fab fa-java",
        "sh": codeIconClass,
        "ini": codeIconClass,
        "cfg": codeIconClass,
        "nfo": "fas fa-file-alt",
        "asc": "fas fa-file-alt",
        "json": codeIconClass,
        "c": codeIconClass,
        "cpp": codeIconClass,
        "cs": codeIconClass,
        "py": "fab fa-python",
        "rb": codeIconClass,
        "pl": codeIconClass,
        "sql": "fas fa-database",
        "asm": codeIconClass,
        "ino": codeIconClass,
        "ts": codeIconClass,
        "tsx": codeIconClass,
        "hbs": codeIconClass,
        "config": codeIconClass,
        "twig": codeIconClass,
        "tpl": codeIconClass,
        "gitignore": codeIconClass,
        "rs": codeIconClass,
        "map": codeIconClass,
        "js": "fab fa-js",
        "ts": "fas fa-t",
        "lock": codeIconClass,
        "dtd": codeIconClass,
        "tmp": codeIconClass,
        "top": codeIconClass,
        "bot": codeIconClass,
        "dat": codeIconClass,
        "bak": codeIconClass,
        "htpasswd": codeIconClass,
        "zip": fileArchiveIconClass,
        "tar": fileArchiveIconClass,
        "gz": fileArchiveIconClass,
        "bz2": fileArchiveIconClass,
        "7z": fileArchiveIconClass,
        "rar": fileArchiveIconClass,
        "mp3": fileAudioIconClass,
        "wav": fileAudioIconClass,
        "ogg": fileAudioIconClass,
        "flac": fileAudioIconClass,
        "aac": fileAudioIconClass,
        "mp4": fileVideoIconClass,
        "avi": fileVideoIconClass,
        "mkv": fileVideoIconClass,
        "mov": fileVideoIconClass,
        "wmv": fileVideoIconClass,
        "flv": fileVideoIconClass,
        "doc": fileWordIconClass,
        "docx": fileWordIconClass,
        "xls": fileExcelIconClass,
        "xlsx": fileExcelIconClass,
        "ppt": filePowerPointIconClass,
        "pptx": filePowerPointIconClass
    };

    const ICON = MIME[EXTENSION] ?? codeIconClass;

    return <Icon className={ICON} />;
}

function Icon({ className }) {
    return <i className={className} />;
}
