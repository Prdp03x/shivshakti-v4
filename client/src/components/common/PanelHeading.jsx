export default function PanelHeading({ icon: Icon, title, description, action }) {
  return (
    <div className="panel-heading">
      <div className="heading-icon"><Icon size={18} /></div>
      <div><h2>{title}</h2><p>{description}</p></div>
      {action}
    </div>
  );
}
