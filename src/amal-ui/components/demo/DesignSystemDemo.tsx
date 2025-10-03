"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Input,
  Select,
  Checkbox,
  Textarea,
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  Modal,
  Drawer,
  AlertDialog,
  Dialog,
  Dropdown,
  Alert,
  Badge,
  Spinner,
  Avatar,
  Progress,
  Accordion,
  Tabs,
  Table,
  Popover,
  Text,
  Heading,
  Link,
  Image,
  Breadcrumb,
  Tooltip,
  useToast,
} from "../index";

export const DesignSystemDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const { addToast } = useToast();

  const dropdownItems = [
    { label: "Profile", value: "profile", icon: "👤" },
    { label: "Settings", value: "settings", icon: "⚙️" },
    { label: "Logout", value: "logout", icon: "🚪" },
  ];

  const accordionItems = [
    {
      id: "1",
      title: "What is Amal Technologies?",
      content:
        "Amal Technologies is a leading technology company specializing in IoT, embedded systems, and industrial automation solutions.",
    },
    {
      id: "2",
      title: "Our Services",
      content:
        "We provide comprehensive IoT solutions, embedded software development, and industrial automation services.",
    },
    {
      id: "3",
      title: "Contact Information",
      content:
        "Get in touch with us at info@amaltech.com or call us at +1-234-567-8900.",
    },
  ];

  const tabItems = [
    {
      id: "overview",
      label: "Overview",
      content: "This is the overview content for our technology solutions.",
    },
    {
      id: "features",
      label: "Features",
      content:
        "Explore the key features of our innovative technology platform.",
    },
    {
      id: "pricing",
      label: "Pricing",
      content:
        "Transparent pricing for all our technology services and solutions.",
    },
  ];

  const tableColumns = [
    { key: "name", title: "Name", sortable: true },
    { key: "role", title: "Role", sortable: true },
    { key: "status", title: "Status", sortable: true },
    {
      key: "actions",
      title: "Actions",
      render: (value: any, row: any) => (
        <Button size="sm" variant="outline">
          Edit
        </Button>
      ),
    },
  ];

  const tableData = [
    { name: "John Doe", role: "Developer", status: "Active" },
    { name: "Jane Smith", role: "Designer", status: "Active" },
    { name: "Bob Johnson", role: "Manager", status: "Inactive" },
  ];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Technology", href: "/products/technology" },
  ];

  return (
    <div className="p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Amal UI Design System
        </h1>
        <p className="text-lg text-gray-600">
          A comprehensive design system built with scalability, security, and
          maintainability in mind.
        </p>
      </motion.div>

      {/* Buttons Section */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
            <Button fullWidth>Full Width</Button>
          </div>
        </CardContent>
      </Card>

      {/* Form Components Section */}
      <Card>
        <CardHeader>
          <CardTitle>Form Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email"
              placeholder="Enter your email"
              helperText="We'll never share your email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              error="Password is required"
            />
            <Select
              label="Country"
              placeholder="Select a country"
              options={[
                { value: "us", label: "United States" },
                { value: "uk", label: "United Kingdom" },
                { value: "ca", label: "Canada" },
              ]}
              value={selectedValue}
              onChange={setSelectedValue}
            />
            <div className="space-y-2">
              <Checkbox label="I agree to the terms" />
              <Checkbox label="Subscribe to newsletter" />
            </div>
          </div>
          <Textarea label="Message" placeholder="Enter your message" rows={4} />
        </CardContent>
      </Card>

      {/* Interactive Components Section */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dropdown */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Dropdown</h3>
            <Dropdown
              trigger={<Button variant="outline">Open Menu</Button>}
              items={dropdownItems}
            />
          </div>

          {/* Alerts */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Alerts</h3>
            <div className="space-y-2">
              <Alert
                variant="info"
                title="Info"
                description="This is an info alert"
              />
              <Alert
                variant="success"
                title="Success"
                description="Operation completed successfully"
              />
              <Alert
                variant="warning"
                title="Warning"
                description="Please review your input"
              />
              <Alert
                variant="error"
                title="Error"
                description="Something went wrong"
              />
            </div>
          </div>

          {/* Badges */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge dot>With Dot</Badge>
            </div>
          </div>

          {/* Spinners */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Spinners</h3>
            <div className="flex items-center gap-4">
              <Spinner size="xs" />
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
              <Spinner size="xl" />
            </div>
          </div>

          {/* Avatars */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Avatars</h3>
            <div className="flex items-center gap-4">
              <Avatar src="/images/avatar.jpg" alt="User" size="sm" />
              <Avatar src="/images/avatar.jpg" alt="User" size="md" />
              <Avatar src="/images/avatar.jpg" alt="User" size="lg" />
              <Avatar alt="John Doe" size="md" />
              <Avatar alt="Jane Smith" size="md" status="online" />
            </div>
          </div>

          {/* Progress */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Progress</h3>
            <div className="space-y-2">
              <Progress value={75} />
              <Progress value={50} variant="success" />
              <Progress value={25} variant="warning" />
              <Progress value={90} variant="error" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accordion Section */}
      <Card>
        <CardHeader>
          <CardTitle>Accordion</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion items={accordionItems} />
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tabs</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs items={tabItems} />
        </CardContent>
      </Card>

      {/* Overlay Components Section */}
      <Card>
        <CardHeader>
          <CardTitle>Overlay Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Modal */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Modal</h3>
            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Example Modal"
              size="md"
            >
              <p className="text-gray-600 mb-4">
                This is an example modal with spring-based animations and modern
                design.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsModalOpen(false)}>Confirm</Button>
              </div>
            </Modal>
          </div>

          {/* Drawer */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Drawer</h3>
            <div className="flex gap-2">
              <Button onClick={() => setIsDrawerOpen(true)}>Open Drawer</Button>
              <Button onClick={() => setIsDrawerOpen(true)} variant="outline">
                Left Drawer
              </Button>
            </div>
            <Drawer
              open={isDrawerOpen}
              onOpenChange={setIsDrawerOpen}
            >
              <p className="text-gray-600 mb-4">
                This is an example drawer that slides in from the side.
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Drawer Content</h4>
                  <p className="text-sm text-gray-600">
                    You can put any content here, including forms, lists, or
                    other components.
                  </p>
                </div>
                <Button onClick={() => setIsDrawerOpen(false)}>Close</Button>
              </div>
            </Drawer>
          </div>

          {/* Alert Dialog */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Alert Dialog</h3>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={() => setIsAlertDialogOpen(true)}
              >
                Delete Item
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAlertDialogOpen(true)}
              >
                Show Warning
              </Button>
            </div>
            <AlertDialog
              isOpen={isAlertDialogOpen}
              onClose={() => setIsAlertDialogOpen(false)}
              onConfirm={() => {
                addToast({
                  variant: "success",
                  title: "Success",
                  description: "Item deleted successfully",
                });
                setIsAlertDialogOpen(false);
              }}
              title="Delete Item"
              description="Are you sure you want to delete this item? This action cannot be undone."
              confirmText="Delete"
              cancelText="Cancel"
              variant="destructive"
            />
          </div>

          {/* Dialog */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Dialog</h3>
            <Button onClick={() => setIsDialogOpen(true)}>Open Dialog</Button>
            <Dialog
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              title="Example Dialog"
              size="md"
            >
              <div className="space-y-4">
                <p className="text-gray-600">
                  This is a focused dialog for forms or important content.
                </p>
                <div className="space-y-2">
                  <Input label="Name" placeholder="Enter your name" />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => setIsDialogOpen(false)}>Save</Button>
                </div>
              </div>
            </Dialog>
          </div>

          {/* Toast */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Toast Notifications</h3>
            <div className="flex gap-2">
              <Button
                onClick={() =>
                  addToast({
                    variant: "success",
                    title: "Success",
                    description: "Operation completed successfully",
                  })
                }
              >
                Success Toast
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  addToast({
                    variant: "error",
                    title: "Error",
                    description: "Something went wrong",
                  })
                }
              >
                Error Toast
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  addToast({
                    variant: "info",
                    title: "Info",
                    description: "Here's some information",
                  })
                }
              >
                Info Toast
              </Button>
            </div>
          </div>

          {/* Tooltip */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Tooltips</h3>
            <div className="flex gap-4">
              <Tooltip content="This is a top tooltip" placement="top">
                <Button variant="outline">Top Tooltip</Button>
              </Tooltip>
              <Tooltip content="This is a bottom tooltip" placement="bottom">
                <Button variant="outline">Bottom Tooltip</Button>
              </Tooltip>
              <Tooltip content="This is a left tooltip" placement="left">
                <Button variant="outline">Left Tooltip</Button>
              </Tooltip>
              <Tooltip content="This is a right tooltip" placement="right">
                <Button variant="outline">Right Tooltip</Button>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Display Components Section */}
      <Card>
        <CardHeader>
          <CardTitle>Data Display Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Table */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Table</h3>
            <Table
              columns={tableColumns}
              data={tableData}
              sortable
              selectable
              pagination
              searchable
            />
          </div>

          {/* Popover */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Popover</h3>
            <Popover
              trigger={<Button variant="outline">Click for Popover</Button>}
              content={
                <div className="p-2">
                  <p className="text-sm">
                    This is a popover with custom content.
                  </p>
                  <Button size="sm" className="mt-2">
                    Action
                  </Button>
                </div>
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Components Section */}
      <Card>
        <CardHeader>
          <CardTitle>Content Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Typography */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Typography</h3>
            <div className="space-y-2">
              <Heading level={1}>Heading Level 1</Heading>
              <Heading level={2}>Heading Level 2</Heading>
              <Heading level={3}>Heading Level 3</Heading>
              <Text variant="body">This is body text with normal weight.</Text>
              <Text variant="caption" weight="medium">
                This is caption text.
              </Text>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Links</h3>
            <div className="space-x-4">
              <Link href="/about">Internal Link</Link>
              <Link href="https://example.com" external>
                External Link
              </Link>
              <Link href="/contact" variant="primary" underline>
                Primary Link
              </Link>
            </div>
          </div>

          {/* Breadcrumbs */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Breadcrumbs</h3>
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* Image */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Image</h3>
            <div className="w-32 h-32">
              <Image
                src="/images/avatar.jpg"
                alt="User Avatar"
                fallback="Avatar"
                className="rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
