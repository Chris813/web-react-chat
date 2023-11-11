import { User } from "@api/auth/types";
import { ConversationProp } from "@api/conversations/types";
import React, { Fragment, useMemo } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { IoClose, IoTrash } from "react-icons/io5";
import Avatar from "@components/Avatar";
import { format } from "date-fns";
import ConfirmModal from "../modal/ConfirmModal";
import AvatarGroup from "@components/AvatarGroup";
//props data={conversation}
// isOpen={drawerOpen}
// onClose={() => setDrawerOpen(false)}
interface ProfileDrawerProps {
  // Define any props you need here
  data: ConversationProp & { users: User[] };
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  // Destructure props here
  data,
  isOpen,
  onClose,
  user,
}) => {
  const title = useMemo(() => {
    return data.name || user.name;
  }, [data, user]);
  const statusText = useMemo(() => {
    if (data?.isGroup) {
      return `${data?.users?.length}人`;
    }
    return "Active";
  }, [data]);
  const joinedDate = useMemo(() => {
    return format(new Date(user.createdAt), "PP");
  }, [user]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as='div' className=' relative z-50' onClose={onClose}>
          <div className=' fixed inset-0 overflow-hidden'>
            <div className=' absolute inset-0 overflow-hidden'>
              <div className=' pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10'>
                <Transition.Child
                  as={Fragment}
                  enter='transform transition ease-in-out duration-500'
                  enterFrom='translate-x-full'
                  enterTo='translate-x-0'
                  leave='transform transition ease-in-out duration-500'
                  leaveTo='translate-x-full'>
                  <Dialog.Panel className=' pointer-events-none w-screen max-w-md'>
                    <div className=' flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl pointer-events-auto'>
                      <div className=' px-4 sm:px-6'>
                        <div className=' flex items-start justify-end'>
                          <div className=' ml-3 flex h-7 items-center'>
                            <button
                              type='button'
                              className=' rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2'
                              onClick={onClose}>
                              <span className='sr-only'>Close Panel</span>
                              <IoClose size={24} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className=' relative mt-6 flex-1 px-4 sm:px-6'>
                        <div className='flex flex-col items-center'>
                          <div className='mb-2'>
                            {data.isGroup ? (
                              <AvatarGroup users={data.users} hasSeen={false} />
                            ) : (
                              <Avatar user={user} />
                            )}
                          </div>
                          <div>{title}</div>
                          <div className=' text-sm text-gray-500'>
                            {statusText}
                          </div>
                          <div className='flex gap-10 my-8'>
                            <div
                              onClick={() => {
                                setIsModalOpen(true);
                              }}
                              className=' flex flex-col items-center cursor-pointer hover:opacity-75'>
                              <div className=' w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center cursor-pointer'>
                                <IoTrash size={24} />
                              </div>
                              <div className='text-sm font-light text-neutral-600'>
                                删除
                              </div>
                            </div>
                          </div>
                          <div className=' w-full pb-5 pt-5'>
                            <dl className='space-y-6 px-4'>
                              {data.isGroup && (
                                <>
                                  <div>
                                    <dt className=' text-gray-500 text-sm font-medium'>
                                      创建者
                                    </dt>
                                    <dd className=' mt-1 text-sm text-gray-900'>
                                      {data?.users[0]?.name}
                                    </dd>
                                  </div>
                                  <hr />
                                  <div>
                                    <dt>
                                      <dt className=' text-gray-500 text-sm font-medium'>
                                        邮箱
                                      </dt>
                                      <dd className=' mt-1 text-sm text-gray-900'>
                                        {data?.users.map((user) => (
                                          <div key={user.id}>{user.email}</div>
                                        ))}
                                      </dd>
                                    </dt>
                                  </div>
                                  <hr />
                                  <div>
                                    <dt className=' text-gray-500 text-sm font-medium'>
                                      创建于
                                    </dt>
                                    <dd className=' mt-1 text-sm text-gray-900'>
                                      <time dateTime={joinedDate}>
                                        {joinedDate}
                                      </time>
                                    </dd>
                                  </div>
                                </>
                              )}

                              {!data?.isGroup && (
                                <div>
                                  <dt className=' text-gray-500 text-sm font-medium'>
                                    邮箱
                                  </dt>
                                  <dd className=' mt-1 text-sm text-gray-900'>
                                    {user.email || "No email provided"}
                                  </dd>
                                </div>
                              )}
                              {!data.isGroup && (
                                <>
                                  <hr />
                                  <div>
                                    <dt className=' text-gray-500 text-sm font-medium'>
                                      注册于
                                    </dt>
                                    <dd className=' mt-1 text-sm text-gray-900'>
                                      <time dateTime={joinedDate}>
                                        {joinedDate}
                                      </time>
                                    </dd>
                                  </div>
                                </>
                              )}
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default ProfileDrawer;
