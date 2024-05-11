import { useSideBarContext } from "@/context/sidebar";
// import { FolderOpenIcon as FolderOpen, ChevronDownIcon, ChevronRightIcon, FolderIcon } from "@heroicons/react/24/outline";
import SidebarSkeleton from "./skeletons/sidebar-skeleton";
import { useFtpDetailsContext } from "@/context/ftp-details-context";
import { findAndCheckOrSetValue, findValueByObjectPath } from "@/helper";
import React from "react";

function FolderOpenIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
    </svg>
}

function FolderIconClose() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
    </svg>
}

function renderNestedDetails(obj, firstKey = null, innerPaths = null) {
    if (firstKey !== null) {
        obj = obj[firstKey];
    }

    return (
        <ul>
            {Object.entries(obj).map(([key, value]) => {
                const isOpen = innerPaths[innerPaths.length - 1] === key || innerPaths.includes(key);

                return (
                    <li key={key}>
                        <details open={isOpen}>
                            <summary>
                                {isOpen ? <FolderOpenIcon /> : <FolderIconClose />}
                                {key}
                            </summary>
                            {typeof value === "object" && Object.keys(value).length > 0 && (
                                renderNestedDetails(value, null ,innerPaths)
                            )}
                        </details>
                    </li>
                );
            })}
        </ul>

    )
}

export default function Paths() {
    const sidebar = useSideBarContext();
    const ftp = useFtpDetailsContext();
    const paths = ftp.state.currentPath;
    const innerPaths = paths.split("/");

    return (
        <>
            {sidebar.roots ? (
                <ul className="menu menu-md p-4 rounded-lg">
                    <li>
                        <details open>
                            <summary>
                                <FolderOpenIcon />
                                {ftp.state.host}
                            </summary>
                            <ul>
                                {sidebar.roots.map((file, key) => {
                                    const innerPathsLen = innerPaths.length;
                                    const isOpen = file.name == innerPaths[1];

                                    return file.type === 1 && (
                                        <li key={key}>
                                            <details open={isOpen ? innerPathsLen == 1 || innerPathsLen >= 1 : false}>
                                                <summary>
                                                    {isOpen ? <FolderOpenIcon /> : <FolderIconClose />}
                                                    {file.name}
                                                </summary>
                                                {file.name == innerPaths[1] && sidebar.currentRoots !== null && renderNestedDetails(sidebar.currentRoots, Object.keys(sidebar.currentRoots)[0], innerPaths)}
                                            </details>
                                        </li>
                                    )
                                })}
                            </ul>
                        </details>
                    </li>
                </ul>
            ) : <SidebarSkeleton />
            }
        </>
    );
}