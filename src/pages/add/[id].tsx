import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import classNames from "classnames";
import { CustomerSchema, CustomerDataSchema } from "../../lib/form-schema";

export default function HomeAdd() {
  const router = useRouter();
  const [id, setId] = useState("new");
  const [form, setForm] = useState<CustomerDataSchema>({
    id: "new",
    firstName: "",
    lastName: "",
    email: "",
    gender: "male",
    address: [
      {
        street: "",
        house: "",
        city: "",
        country: "",
      },
    ],
  });

  useEffect(() => {
    if (router.query.id) {
      if (router.query.id != "new") {
        let id = router.query.id as string;
        setId(id);
        loadData(id);
      }
    }
  }, [router.query.id]);

  const loadData = async (id: string) => {
    const res = await fetch("/api/customers/retrieve", {
      body: JSON.stringify({
        filter: {
          _id: id,
        },
        sort: {},
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await res.json();
    console.log(data);
    if (data.result == 200) {
      if (data.data.length > 0) {
        setForm(data.data[0]);
      }
    }
  };

  const saveData = async (values: CustomerDataSchema) => {
    const res = await fetch("/api/customers/insert", {
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await res.json();
    if (data.result == 200) {
      router.push("/");
    } else {
      console.error(data);
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={form}
      validationSchema={CustomerSchema}
      onSubmit={(values, { setSubmitting }) => {
        saveData(values);
      }}
    >
      {({ values, submitForm, errors, isSubmitting }) => (
        <div className="p-12 flex flex-col">
          <div className="flex flex-row justify-between text-sm mb-2 border-b">
            <div className="font-bold">Insert Customer</div>
            <div className="flex flex-row">
              <div
                onClick={() => router.push("/")}
                className="p-2 mr-2 cursor-pointer hover:text-blue-500"
              >
                Cancel
              </div>
              <div
                onClick={() => submitForm()}
                className="p-2 cursor-pointer hover:text-blue-500"
              >
                Save
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <Form>
              <div className="flex flex-row mb-2">
                <div className="flex-col p-2 w-1/2">
                  <div className="text-sm">FirstName</div>
                  <Field
                    type="text"
                    name="firstName"
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-red-400 text-xs mb-2"
                  />
                </div>
                <div className="flex-col p-2 w-1/2">
                  <div className="text-sm">LastName</div>
                  <Field
                    type="text"
                    name="lastName"
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-red-400 text-xs mb-2"
                  />
                </div>
              </div>

              <div className="flex flex-row mb-2">
                <div className="flex-col p-2 w-1/2">
                  <div className="text-sm">Email</div>
                  <Field
                    type="email"
                    name="email"
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-400 text-xs mb-2"
                  />
                </div>
                <div className="flex-col p-2 w-1/2">
                  <div className="text-sm">Gender</div>

                  <div
                    className="flex flex-row items-center"
                    role="group"
                    aria-labelledby="my-radio-group"
                  >
                    <label className="flex flex-row p-2">
                      <Field type="radio" name="gender" value="male" />
                      <div className="ml-1">Male</div>
                    </label>
                    <label className="flex flex-row p-2">
                      <Field type="radio" name="gender" value="female" />
                      <div className="ml-1">Female</div>
                    </label>
                  </div>
                </div>
              </div>

              <FieldArray
                name="address"
                render={(arrayHelpers) => (
                  <div className="flex flex-col">
                    <div className="border-b text-sm font-bold m-2 p-2">
                      Address
                    </div>

                    {values.address && values.address.length > 0 ? (
                      values.address.map((adr, index) => (
                        <div key={index}>
                          <div className="flex flex-row">
                            <div className="flex flex-col p-2">
                              <div className="text-sm">Street</div>
                              <Field
                                name={`address.${index}.street`}
                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                              />
                              <ErrorMessage
                                name={`address.${index}.street`}
                                component="div"
                                className="text-red-400 text-xs mb-2"
                              />
                            </div>
                            <div className="flex flex-col p-2">
                              <div className="text-sm">House</div>
                              <Field
                                name={`address.${index}.house`}
                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                              />
                              <ErrorMessage
                                name={`address.${index}.house`}
                                component="div"
                                className="text-red-400 text-xs mb-2"
                              />
                            </div>
                            <div className="flex flex-col p-2">
                              <div className="text-sm">City</div>
                              <Field
                                name={`address.${index}.city`}
                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                              />
                              <ErrorMessage
                                name={`address.${index}.city`}
                                component="div"
                                className="text-red-400 text-xs mb-2"
                              />
                            </div>

                            <div className="flex flex-col p-2">
                              <div className="text-sm">Country</div>
                              <Field
                                name={`address.${index}.country`}
                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                              />
                              <ErrorMessage
                                name={`address.${index}.country`}
                                component="div"
                                className="text-red-400 text-xs mb-2"
                              />
                            </div>

                            <div
                              className={classNames(
                                "text-lg font-bold p-2 cursor-pointer hover:text-blue-500"
                              )}
                              onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                            >
                              -
                            </div>
                            <div
                              className={classNames(
                                { hidden: index > 0 },
                                "text-lg font-bold p-2 cursor-pointer hover:text-blue-500"
                              )}
                              onClick={() => arrayHelpers.insert(index, "")} // insert an empty string at a position
                            >
                              +
                            </div>
                          </div>
                          <div>
                            {typeof errors.address === "string" ? (
                              <div>{errors.address}</div>
                            ) : (
                              ""
                            )}
                          </div>
                          {/*<ErrorMessage name="address" component="div" className="text-red-400 text-xs mb-2" />*/}
                        </div>
                      ))
                    ) : (
                      <div
                        className="text-center p-2 cursor-pointer hover:text-blue-500"
                        onClick={() => arrayHelpers.push("")}
                      >
                        {/* show this when user has removed all friends from the list */}
                        Add an Address
                      </div>
                    )}
                  </div>
                )}
              />
            </Form>
          </div>
        </div>
      )}
    </Formik>
  );
}
