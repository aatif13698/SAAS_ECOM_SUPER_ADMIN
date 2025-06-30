import useDarkmode from '@/hooks/useDarkMode';
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import DataTable from "react-data-table-component";
import Button from '../../components/ui/Button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Tooltip from '../../components/ui/Tooltip';
import Icons from '@/components/ui/Icon';
import Swal from "sweetalert2";
import debounceFunction from '@/helper/Debounce';
import loadingImg from "../../assets/images/logo/Kosmo-Clinic-Logo.png"
import FormLoader from '@/Common/formLoader/FormLoader';
import { DialogContent } from "@mui/material";

// import ProfileImage from "../../assets/images/users/user-1.jpg"
import IconImg from "../../assets/images/aestree-logo.png"
import { icon } from 'leaflet';
import tableConfigure from '../common/tableConfigure';
import queryService from '@/services/query/query.service';




function Query({ centered, noFade, scrollContent }) {
    const [isDark] = useDarkmode()
    const { noDataStyle, customStyles } = tableConfigure();
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false);
    const [pending, setPending] = useState(true);
    const [totalRows, setTotalRows] = useState();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [isViewed, setIsViewed] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const [paginationData, setPaginationData] = useState();
    const [id, setId] = useState(null);
    const [keyWord, setkeyWord] = useState("");
    const [toggleWord, setToggleWord] = useState(false);
    const [iconImgErr, setIconImgErr] = useState("");
    const [imgPreview, setImgPreviwe] = useState(null);
    const [selectedFile, setselectedFile] = useState(null);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [showModal, setShowModal] = useState(false);


    const handleCloseLoadingModal = () => {
        setShowLoadingModal(false);
    };


    const [formData, setFormData] = useState({
        name: "",
        description: "",
        slug: "",
    });
    const [formDataErr, setFormDataErr] = useState({
        name: "",
        description: "",
        slug: "",
        icon: ""
    });
    const {
        name,
        slug,
        description,
    } = formData;



    const closeModal = () => {
        setShowModal(false);
        setLoading(false)
        setFormData((prev) => ({
            ...prev,
            name: "",
            description: "",
            slug: "",
        }));
        setFormDataErr((prev) => ({
            ...prev,
            name: "",
            description: "",
            slug: "",
            icon: ""
        }));
        setImgPreviwe(null);
        setselectedFile(null);
        setLoading(false);
        setId(null)
        setRefresh((prev) => prev + 1)
    };

    const openModal = () => {
        setShowModal(!showModal);
    };


    const handleFilter = (e) => {
        let newkeyWord = e.target.value;
        setkeyWord(newkeyWord);
        debounceSearch(newkeyWord)
    };


    const debounceSearch = useCallback(
        debounceFunction(
            async (nextValue) => {
                try {
                    setPending(true)
                    const response = await queryService.getAllList({ page, keyword: nextValue, perPage })
                    setPaginationData(response?.data?.categories)
                    setTotalRows(response?.data?.count)
                    setPending(false)
                } catch (error) {
                    setPending(false)
                    console.log("error while getting faq list", error);
                }
            },
            1000
        ),
        []
    );


    function handleCreate() {
        openModal()
        setIsViewed(false)
        setFormData((prev) => ({
            ...prev,
            name: "",
            description: "",
            slug: "",
        }));
        setFormDataErr((prev) => ({
            ...prev,
            name: "",
            description: "",
            slug: "",
            icon: ""
        }));
        setId(null)
    }

    function handleChange(e) {
        const { name, value } = e.target;
        const errorMessages = {
            name: "Category name is Required",
            slug: "Slug is Required",
            description: "Description is Required",
        };
        setFormDataErr((prev) => ({
            ...prev,
            [name]: value === "" ? errorMessages[name] : "",
        }));
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function validation() {
        const fieldErrors = {
            name: "Category Name is Required",
            slug: "Slug is Required",
            description: "Description is Required",
        };
        let errorCount = 0;
        const errors = {};
        Object.keys(fieldErrors).forEach((field) => {
            if (!formData[field]) {
                errors[field] = fieldErrors[field];
                errorCount++;
            } else {
                errors[field] = "";
            }
        });
        if (!id) {
            if (!selectedFile) {
                errors["icon"] = "Icon is required"
            }

        }
        setFormDataErr((prev) => ({
            ...prev,
            ...errors,
        }));
        return errorCount > 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const isError = validation()
        if (!isError) {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("slug", slug);
            formData.append("description", description);
            if (selectedFile) {
                formData.append("icon", selectedFile);
            }
            setLoading(true)
            if (id) {
                try {
                    formData.append("categoryId", id)
                    const response = await queryService.update(formData)
                    closeModal()
                    toast.success(response.data.message)

                } catch (error) {
                    setLoading(false);
                    alert(error?.response?.data?.message)
                    console.log("Error while Updating business Unit", error);
                }
            } else {
                try {
                    const response = await queryService?.create(formData)
                    closeModal()
                    toast.success(response.data.message)
                } catch (error) {
                    setLoading(false);
                    alert(error?.response?.data?.message)
                    console.log("Error while creating", error);
                }
            }
        }
    }

      async function handleView(row) {
        try {
                setShowLoadingModal(true)
                const response = await queryService.getParticularQuery(row?._id);
                setShowLoadingModal(false);
                setTimeout(() => {
                    navigate("/view/query", { state: { client: response?.data?.data?.data } })
                }, 600);
           
        } catch (error) {
            console.log("error while getting client data", error);
        }
    }

    const handleEdit = (row) => {
        const id = row._id;
        openModal()
        setIsViewed(false)
        setId(id)
        setFormData((prev) => ({
            ...prev,
            name: row?.name,
            slug: row?.slug,
            description: row?.description
        }))
        setImgPreviwe(`http://localhost:8088/icon/${row?.icon}`)
        setFormDataErr((prev) => ({
            ...prev,
            name: "",
            description: "",
            slug: "",
            icon: ""
        }))
    };

    const handleDelete = (row) => {
        const id = row._id;
        deleteOne({ id, page, keyword: keyWord, perPage });
        // Swal.fire({
        //     title: `Are you sure you want to delete ${row.name}?`,
        //     icon: "error",
        //     showCloseButton: true,
        //     showCancelButton: true,
        //     confirmButtonColor: isDark ? "#FF4C4C" : "#DC3545",
        //     cancelButtonColor: isDark ? "rgb(110 147 143)" : "rgb(4 203 182)",
        //     // background: isDark ? "rgb(29 55 54)" : "#FFFFFF",
        //     color: isDark ? "#FFFFFF" : "#000000",
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         deleteOne({ id, page, keyword: keyWord, perPage });
        //     }
        // });
    };


    async function deleteOne({ id, page, keyword: keyWord, perPage }) {
        try {
            const response = await queryService.deleteOne({ id, page, keyword: keyWord, perPage })
            toast.success("Query delete successfully.");
            setRefresh((prev) => prev + 1)
        } catch (error) {
            console.log("Error while deleting Business Unit", error);
        }
    }

    const handleActive = async (row) => {
        const id = row._id
        let status = "1"
        setToggleWord(false)
        setShowLoadingModal(true)
        row.isActive ? (status = "0") : (status = "1")
        try {
            const response = await queryService.activeInActive({ id, status, page, keyword: keyWord, perPage })
            setShowLoadingModal(false)
            setRefresh((prev) => prev + 1)
        } catch (error) {
            console.log("Error While doing active and inactive", error);
        }
    }


    const handleKeyPress = (e) => {
        const value = e.target.value;
        const cleanedValue = value.replace(/[^6-9\d]/g, "");
        if (cleanedValue.trim() !== "") {
            e.target.value = cleanedValue;
        } else {
            e.target.value = "";
        }
    };

    const columns = [
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.email,
        },
        {
            name: "Phone",
            selector: (row) => row.phone,
        },
        {
            name: "Message",
            selector: (row) => row.message,
        },
       
        {
            name: "Action",
            selector: (row) => {
                return (
                    <div className="flex  space-x-1 rtl:space-x-reverse ">
                        <Tooltip
                            content="View"
                            placement="top"
                            arrow
                            animation="shift-away"
                        >
                            <button
                                className="action-btn"
                                type="button"
                                onClick={() => handleView(row)}
                            >
                                <Icon icon="heroicons:eye" />
                            </button>
                        </Tooltip>
                        <Tooltip
                            content=" Delete"
                            placement="top"
                            arrow
                            animation="shift-away"
                            theme="danger"
                        >
                            <button
                                className="action-btn"
                                type="button"
                                onClick={() => handleDelete(row)}
                            >
                                <Icon icon="heroicons:trash" />
                            </button>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        getAllList({ page, keyword: keyWord, perPage })
    }, [refresh])


    async function getAllList(data) {
        try {
            const response = await queryService.getAllList(data);
            console.log("response",response);
            
            setPaginationData(response?.data?.data?.data)
            setTotalRows(response?.data?.data?.total)
            setPending(false)
        } catch (error) {
            setPending(false)
            console.log("Error while getting list", error);
        }
    }

    const handlePerRowChange = async (perPage) => {
        try {
            const response = await queryService.getAllList({ page, keyword: keyWord, perPage })
            setPaginationData(response?.data?.categories)
            setTotalRows(response?.data?.count)
            setPerPage(perPage)
            setPending(false)
        } catch (error) {
            setPending(false)
            console.log("Error while getting list", error);
        }
    };

    const handlePageChange = async (page) => {
        try {
            const response = await queryService.getAllList({ page, keyword: keyWord, perPage })
            setPaginationData(response?.data?.categories)
            setTotalRows(response?.data?.count)
            setPage(page)
            setPending(false)
        } catch (error) {
            setPending(false)
            console.log("Error while getting list", error);
        }
    };

    const handleFileChange = (e) => {
        const { name, value } = e.target;
        if (name == "profileImage") {
            if (!selectedFile && value == "") {
                setFormDataErr((prev) => ({
                    ...prev,
                    icon: "Icon is required",
                }));
            } else {
                setFormDataErr((prev) => ({
                    ...prev,
                    icon: "",
                }));
            }
        }
        setIconImgErr("");
        let fileSize = 0;
        let errorCount = 0;
        const file = e.target.files[0];
        if (file) {
            fileSize = file.size / 1024;
            if (!file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                setIconImgErr("Only img file is allowd");
                errorCount++;
            }
            if (fileSize > 1024) {
                setIconImgErr("file size less than 1MB");
                errorCount++;
            }
            if (errorCount === 0) {
                const imageAsBase64 = URL.createObjectURL(file);
                setselectedFile(file);
                setImgPreviwe(imageAsBase64);
            }
        }
    };
    const subHeaderComponent = (
        <div className="w-full grid xl:grid-cols-2 md:grid-cols-1 md:text-start gap-3  ">
             <div className="grid lg:justify-start md:justify-start">
               List Query
            </div>
            <div className="grid lg:justify-end md:justify-start">
                <input
                    type="text"
                    placeholder="Search..."
                    className="form-control rounded-md px-4 py-2 border border-lightborderInputColor  dark:border-darkInput text-lightinputTextColor  bg-lightBgInputColor dark:bg-darkInput dark:text-white"
                    onChange={handleFilter}
                />
            </div>
           
        </div>
    );


    return (
        <>
            <div className={` shadow-md ${isDark ? "bg-darkSecondary text-white" : "bg-white"}`}>
                <div className="text-end mb-4">
                    <div className="flex gap-5 justify-between"></div>
                </div>
                {/* table */}
                <DataTable
                    columns={columns}
                    data={paginationData}
                    highlightOnHover
                    customStyles={customStyles}
                    fixedHeader
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={handlePerRowChange}
                    // selectableRows
                    pointerOnHover
                    progressPending={pending}
                    subHeader
                    subHeaderComponent={subHeaderComponent}
                    // paginationComponentOptions={paginationOptions}
                    noDataComponent={<div className={`${isDark ? "bg-darkSecondary" : ""}`} style={{ display: "flex", justifyContent: "center", padding: "2rem", border: "2px solid white", flexDirection: "row", gap: "1rem", width: "100%" }}>

                        <p className="text-center text-bold text-2xl" style={noDataStyle}>
                            There is no record to display
                        </p>
                    </div>
                    }
                    progressComponent={
                        <div className={`${isDark ? "bg-darkSecondary" : ""}`} style={{ display: "flex", justifyContent: "center", padding: "2rem", border: "2px solid white", flexDirection: "row", gap: "1rem", width: "100%" }}>
                            <FormLoader />
                        </div>
                    }
                />
               

                {/* loding dialog */}
                <Transition appear show={showLoadingModal} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-[99999]"
                        onClose={handleCloseLoadingModal}
                    >
                        {(
                            <Transition.Child
                                as={Fragment}
                                enter={noFade ? "" : "duration-300 ease-out"}
                                enterFrom={noFade ? "" : "opacity-0"}
                                enterTo={noFade ? "" : "opacity-100"}
                                leave={noFade ? "" : "duration-200 ease-in"}
                                leaveFrom={noFade ? "" : "opacity-100"}
                                leaveTo={noFade ? "" : "opacity-0"}
                            >
                                <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
                            </Transition.Child>
                        )}

                        <div className="fixed inset-0 overflow-y-auto">
                            <div
                                className={`flex min-h-screen min-w-full justify-center text-center p-6 items-center "
                                    }`}
                            >
                                <Transition.Child
                                    as={Fragment}
                                    enter={noFade ? "" : "duration-300  ease-out"}
                                    enterFrom={noFade ? "" : "opacity-0 scale-95"}
                                    enterTo={noFade ? "" : "opacity-100 scale-100"}
                                    leave={noFade ? "" : "duration-200 ease-in"}
                                    leaveFrom={noFade ? "" : "opacity-100 scale-100"}
                                    leaveTo={noFade ? "" : "opacity-0 scale-95"}
                                >
                                    <Dialog.Panel
                                        className={`w-full transform overflow-hidden rounded-md
                                       bg-white dark:bg-darkSecondary text-left align-middle shadow-xl transition-alll max-w-[17rem] `}
                                    >
                                        <div className="flex flex-col justify-center mt-5 items-center gap-2">
                                            <FormLoader />
                                            {
                                                toggleWord ? <p className='py-3'>Loading...</p> : <p className='py-5'>processing...</p>
                                            }

                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>

            </div>
        </>
    )
}

export default Query