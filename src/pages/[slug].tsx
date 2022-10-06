import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { ParsedUrlQuery } from 'querystring';
import { getAllProperties, getProperty } from './api/deliveryApi';
import { Property } from './api/model';
import { useState } from 'react'
import { Disclosure, Tab } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'

// We filter out properties sold more than 1 month ago.
const soldOnGtMonth = 1;

interface Props {
  property: Property | null;
}

interface Params extends ParsedUrlQuery {
  slug: string;
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const now = new Date();
  const soldOnGt = new Date(now.setMonth(now.getMonth() - soldOnGtMonth));
  const properties = await getAllProperties(soldOnGt);

  const paths = properties.map(p => (
    {
      params: {
        slug: p.slug
      }
    }
  ));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props, Params> =
  async (context) => {
    const { slug } = context.params!
    const property = await getProperty(slug);

    return await Promise.resolve({
      props: {
        property
      }
    });
  };

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function formatPrice(price?: number) {
  return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
}

function getTypeLabel(type?: string) {
  if (!type) {
    return "";
  }
  const tokens = type.split('.');
  return tokens[tokens.length - 1];
}

const Property: NextPage<Props> = ({ property }) => {
  const [language] = useState('en-US')

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl lg:pt-16 px-4 sm:pt-10 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="lg:hidden mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{property?.title[language]}</h1>
          <div className="mt-3">
            <p className="text-3xl tracking-tight text-gray-900">$ {formatPrice(property?.price)}</p>
          </div>
        </div>
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          <Tab.Group as="div" className="flex flex-col-reverse">
            <div className="mx-auto mt-6 w-full max-w-2xl sm:block lg:max-w-none">
              <Tab.List className="grid grid-cols-4 gap-6">
                {
                  property?.propertyToImages.map((image, i) => (
                    <Tab
                      key={i}
                      className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                    >
                      {({ selected }) => (
                        <>
                          <span className="absolute inset-0 overflow-hidden rounded-md">
                            <img src={image.thumbnail?.href} alt="" className="h-full w-full object-cover object-center" />
                          </span>
                          <span
                            className={classNames(
                              selected ? 'ring-indigo-500' : 'ring-transparent',
                              'pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2'
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Tab>
                  ))}
              </Tab.List>
            </div>
            <Tab.Panels className="aspect-w-1 aspect-h-1 w-full">
              {property?.propertyToImages.map((image, i) => (
                <Tab.Panel key={i}>
                  <img
                    src={image.preview?.href}
                    className="h-full w-full object-cover object-center sm:rounded-lg"
                  />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
          <div className="mt-10 px-4 sm:px-0 lg:mt-0">
            <div className="hidden lg:block">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{property?.title[language]}</h1>
              <div className="mt-3">
                <p className="text-3xl tracking-tight text-gray-900">$ {formatPrice(property?.price)}</p>
              </div>
            </div>
            <div className="mt-6">
              <Disclosure as="div" defaultOpen={true}>
                {({ open }) => (
                  <>
                    <h3>
                      <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                        <span
                          className={classNames(open ? 'text-indigo-600' : 'text-gray-900', 'text-xl font-bold')}
                        >
                          Description
                        </span>
                        <span className="ml-6 flex items-center">
                          {open ? (
                            <MinusIcon
                              className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                              aria-hidden="true"
                            />
                          ) : (
                            <PlusIcon
                              className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </Disclosure.Button>
                    </h3>
                    <Disclosure.Panel as="div" className="prose prose-sm pb-6">
                      <div
                        className="space-y-6 text-base text-gray-700"
                        dangerouslySetInnerHTML={{ __html: property?.description[language] || "" }}
                      />
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
            <div className="divide-y divide-gray-200 border-t">
              <Disclosure as="div">
                {({ open }) => (
                  <>
                    <h3>
                      <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                        <span
                          className={classNames(open ? 'text-indigo-600' : 'text-gray-900', 'text-xl font-bold')}
                        >
                          Location
                        </span>
                        <span className="ml-6 flex items-center">
                          {open ? (
                            <MinusIcon
                              className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                              aria-hidden="true"
                            />
                          ) : (
                            <PlusIcon
                              className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </Disclosure.Button>
                    </h3>
                    <Disclosure.Panel as="div" className="prose prose-sm pb-6">
                      <ul>
                        <li><span className="font-bold">Address:</span> {property?.address}</li>
                        <li className="pt-2"><span className="font-bold">City/State:</span> {property?.cityState}</li>
                        <li className="pt-2"><span className="font-bold">ZIP:</span> {property?.zIP}</li>
                      </ul>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
            <div className="divide-y divide-gray-200 border-t">
              <Disclosure as="div">
                {({ open }) => (
                  <>
                    <h3>
                      <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                        <span
                          className={classNames(open ? 'text-indigo-600' : 'text-gray-900', 'text-xl font-bold')}
                        >
                          Details
                        </span>
                        <span className="ml-6 flex items-center">
                          {open ? (
                            <MinusIcon
                              className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                              aria-hidden="true"
                            />
                          ) : (
                            <PlusIcon
                              className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </Disclosure.Button>
                    </h3>
                    <Disclosure.Panel as="div" className="prose prose-sm pb-6">
                      <ul>
                        <li><span className="font-bold">Type:</span> {getTypeLabel(property?.type)}</li>
                        <li className="pt-2"><span className="font-bold">Built:</span> {property?.built}</li>
                      </ul>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
            <div className="divide-y divide-gray-200 border-t">
              <Disclosure as="div">
                {({ open }) => (
                  <>
                    <h3>
                      <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                        <span
                          className={classNames(open ? 'text-indigo-600' : 'text-gray-900', 'text-xl font-bold')}
                        >
                          Documents
                        </span>
                        <span className="ml-6 flex items-center">
                          {open ? (
                            <MinusIcon
                              className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                              aria-hidden="true"
                            />
                          ) : (
                            <PlusIcon
                              className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </Disclosure.Button>
                    </h3>
                    <Disclosure.Panel as="div" className="prose prose-sm pb-6">
                      <div className="grid grid-cols-4 gap-6">
                        {
                          property?.propertyToDocuments.map((doc, i) => (
                            <div key={i}>
                              <a
                                className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                                href={doc.downloadOriginal?.href}
                                target='_blank'
                              >
                                <>
                                  <span className="absolute inset-0 overflow-hidden rounded-md">
                                    <img src={doc.thumbnail?.href} alt="" className="h-full w-full object-cover object-center" />
                                  </span>
                                  <span
                                    className='ring-transparent pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2'
                                    aria-hidden="true"
                                  />
                                </>
                              </a>
                              <div className="justify-center flex mt-3 text-sm">{doc.fileName}</div>
                            </div>
                          ))}
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Property
