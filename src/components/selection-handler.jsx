import React, { useEffect, useRef } from "react";

function SelectionWrapper({ children }) {
    const sectionRef = useRef();

    // Currently not in use....
    return (
        <section 
            ref={sectionRef}
        >
            {children}
        </section>
    )
}

export default SelectionWrapper;