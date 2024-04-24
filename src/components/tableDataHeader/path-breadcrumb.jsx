import { Breadcrumbs } from "@material-tailwind/react";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";

export default function BreadcrumbsWithIcon({ currentPath }) {

  let dirs = currentPath.split("/");
  console.log(currentPath !== "/" && currentPath !== "." && currentPath !== "");

  return (
    <Breadcrumbs>

      {
        currentPath == "/" || currentPath == "." || currentPath == "" ? (
          <HomeBreadCrumb />
        ) : <ShowCrumbsWithPaths dirs={dirs} />
      }
      {/* {
        currentPath == "/" || currentPath == "." || currentPath == "" ? (
          <HomeBreadCrumb />
        ) : dirs.map((item, index) => (
          <a
            key={index}
            href="#"
            className="rounded-full bg-white px-3 py-1 font-medium text-gray-900"
          >
            {item}
          </a>
        ))
      } */}

      {/* {
        currentPath == "/" || currentPath == "." || currentPath == ""
          ?
          <HomeBreadCrumb /> :

          <HomeBreadCrumb />
          
          // Loop Through
          dirs.map((item, index) => (
            item &&
            (
                <a
                  key={index}
                  href="#"
                  className="rounded-full bg-white px-3 py-1 font-medium text-gray-900"
                >
                  {item}
                </a>
             )
          ))
      } */}
    </Breadcrumbs>
    // <Breadcrumbs>
    //   {
    //     currentPath == "/" || currentPath == "." || currentPath == "" ? (
    //       <HomeBreadCrumb />
    //     ) : (
    //       <>
    //         <HomeBreadCrumb />
    //         <a href="#" className="opacity-60">
    //           <span>Components</span>
    //         </a >
    //         <a href="#">Breadcrumbs</a>
    //       </>
    //     )
    //   }
    // </Breadcrumbs >
  );
}

function ShowCrumbsWithPaths({ dirs }) {
  return (
    <>
      <HomeBreadCrumb />
      {dirs.map((item, index) => (
        item &&
        (
          <a
            key={index}
            href="#"
            className="opacity-60"
          >
            {item}
          </a>
        )
      ))}
    </>
  )
}

function HomeBreadCrumb() {
  return (
    <a href="#" className="opacity-60">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    </a>
  )
}

// export function list() {
//   return (
//     <Breadcrumbs>
//       <a href="#" className="opacity-60">
//         <span>Components</span>
//       </a>
//     </Breadcrumbs>
//   );
// }