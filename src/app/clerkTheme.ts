import { experimental_createTheme as createTheme } from "@clerk/themes";

export const clerkTheme = createTheme({
  elements: {
    // Box
    logoBox: "[&>a]:border! [&>a]:border-primary/50!",
    cardBox: "border! border-primary/50! bg-card!",
    scrollBox: "bg-card! shadow-none! border-l! border-input!",
    pageScrollBox: "border-t! border-input",
    // Card
    card: "bg-card rounded-none",
    actionCard: "border border-primary/50 bg-card",
    // Header
    headerTitle: "text-foreground",
    headerSubtitle: "text-foreground/70",
    identityPreviewText: "text-foreground/70",
    identityPreviewEditButton:
      "text-primary/80 hover:text-primary active:text-primary focus:ring-3 focus:ring-ring",
    // Form
    socialButtonsBlockButton:
      "shadow-none! ring-ring! ring-offset-input! bg-secondary! text-foreground! hover:bg-foreground/10! focus:bg-foreground/20! active:ring-2! focus:ring-2! focus:ring-offset-2! dark:hover:bg-foreground/20! dark:focus:bg-foreground/30!",
    socialButtonsProviderIcon: "invert-0! dark:invert-[1]!",
    providerIcon: "invert-0! dark:invert-[1]!",
    dividerLine: "bg-foreground/40",
    formFieldLabel: "text-foreground",
    lastAuthenticationStrategyBadge: "text-foreground bg-secondary",
    formFieldHintText: "text-foreground/70",
    formFieldInput:
      "ring-1 ring-input py-2 bg-background text-foreground shadow-none! ring-offset-input hover:ring-foreground/20 focus:ring-2 focus:ring-ring focus:ring-offset-2 placeholder:text-foreground/60",
    checkbox: "checked:bg-primary",
    otpCodeFieldInput:
      "ring-1 ring-input bg-background text-foreground shadow-none! ring-offset-input hover:ring-foreground/40 focus:ring-2 focus:ring-ring focus:ring-offset-2",
    formFieldInputShowPasswordButton:
      "text-foreground/40 ring-ring shadow-none! hover:text-foreground/70 focus:ring-3",
    formButtonPrimary:
      "text-primary-foreground bg-primary/80 dark:bg-primary/60 duration-200 hover:bg-primary/80 focus:bg-primary/80 shadow-none! ring-offset-card ring-ring focus:ring-2 focus:ring-offset-2",
    buttonArrowIcon: "text-primary-foreground",
    formButtonReset:
      "hover:text-foreground! bg-secondary/40! hover:bg-secondary/80! active:bg-secondary! duration-300 text-foreground! focus:ring-2! focus:ring-ring!",
    formFieldAction:
      "text-primary ring-ring rounded hover:text-primary active:text-primary focus:outline-hidden focus:ring-2",
    formFieldSuccessText: "text-green-600",
    formResendCodeLink:
      "text-primary ring-ring rounded hover:text-primary active:text-primary focus:outline-hidden focus:ring-2",
    formFieldRadioLabelTitle: "text-foreground",
    // Alt Button
    alternativeMethodsBlockButton:
      "border! border-input py-2 bg-card text-foreground/70 ring-ring shadow-none! ring-offset-card hover:bg-input/80 focus:ring-2 focus:ring-offset-2",
    avatarImageActionsUpload:
      "text-foreground! ring-2! ring-input! shadow-none! ring-offset-input! hover:bg-secondary/80! active:bg-secondary! focus:ring-ring! focus:ring-offset-2!",
    avatarImageActionsRemove:
      "shadow-none! hover:bg-secondary/80! active:bg-secondary! focus:ring-2! focus:ring-ring!",
    // User Menu
    userButtonTrigger:
      "shadow-none! ring-ring ring-offset-input active:ring-2 focus:ring-2 focus:ring-offset-2",
    userButtonPopoverCard: "border border-primary/50",
    userButtonPopoverMain: "bg-card",
    userPreviewTextContainer: "*:text-foreground",
    userButtonPopoverFooter: "hidden",
    userButtonPopoverActions: "border-border",
    userButtonPopoverActionButton:
      "border-secondary! text-foreground/80! hover:bg-secondary/80! hover:text-foreground!",
    userButtonPopoverCustomItemButton:
      "border-secondary! text-foreground/80! hover:bg-secondary/80! hover:text-foreground!",
    userPreview: "text-foreground",
    menuButton:
      "text-foreground! hover:bg-secondary! active:bg-secondary! focus:ring-2! focus:ring-ring!",
    menuItem: "hover:bg-secondary! active:bg-secondary!",
    modalCloseButton:
      "text-foreground hover:text-foreground/80 hover:bg-secondary active:bg-secondary focus:ring-2 focus:ring-ring",
    modalBackdrop: "z-99999! backdrop-blur-md!",
    // Profile
    profilePage: "*:border-border",
    profileSectionPrimaryButton:
      "text-foreground bg-secondary/60! duration-200 shadow-none! ring-offset-card ring-ring hover:text-foreground hover:bg-secondary! focus:bg-primary/40 focus:ring-2 focus:ring-offset-2",
    profileSectionPrimaryButton__danger: "text-destructive! bg-secondary/40!",
    profileSectionTitleText: "text-foreground",
    profileSectionItem: "[&_p]:text-foreground",
    // NavBar
    navbar: "bg-none! bg-card! [&_h1]:text-foreground [&_p]:text-foreground/70",
    navbarMobileMenuRow: "bg-none! bg-card!",
    navbarMobileMenuButton:
      "text-foreground/80 hover:bg-secondary focus:ring-1 focus:ring-ring",
    navbarButton:
      "text-foreground/80 data-[active=true]:text-foreground hover:bg-secondary focus:ring-1 focus:ring-ring",
    // Footer
    footer:
      "[&>.cl-internal-1dauvpw]:hidden! [&>.cl-internal-1dauvpw]:bg-primary/80! [&>.cl-internal-1dauvpw]:text-primary-foreground! dark:[&>.cl-internal-1dauvpw]:bg-primary!",
    footerAction:
      "bg-card/80! w-full! flex! justify-center! pt-4! border-t! border-foreground/30! dark:border-foreground/10! dark:bg-card/60!",
    footerActionText: "text-foreground!",
    footerActionLink:
      "text-primary! ring-ring! rounded! hover:text-primary! active:text-primary! focus:outline-hidden! focus:ring-2!",
    // Devices
    activeDevice: "[&_p]:text-foreground/70",
    // Extras
    badge: "text-primary bg-primary/20",
    dividerText: "text-foreground/70",
    backLink: "text-foreground hover:underline",
  },
});
