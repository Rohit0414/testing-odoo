# -*- coding: utf-8 -*-
{
    'name': "Testing Odoo",
    'summary': """
        Unlock real-time Odoo data insights with an AI Analyst powered by ChatGPT technology. This Artificial Intelligence agent provides instant answers, acting as your personal data analytics assistant. Query sales, inventory, CRM, and more via natural language – information is just a prompt away. Get AI analytics and dashboard-like clarity without complex tools like Power BI or Tableau. Your Odoo AI for direct data exploration using your OpenAI key (compatible with models like Gemini via API). Get real time insights.
        Can be your powerbi or pbi, ai dashboard with KPI, AI reports. Works with openai chat gpt key. AI Agent, ml, Dashboard AI, AI Data Analytics, ai, ai odoo,  Provide realtime results and does not use cloud. Your data never leaver your Odoo server so no need of refresh or export, sync data daily. This is an AI Agent RAG like can answer any installed Odoo module query example sale, inventory, CRM, stock,customer,product,project,sales,invoices,order,invoices and more
    """,
    'description': """
        Unlock real-time Odoo data insights with an AI Analyst powered by ChatGPT technology. This Artificial Intelligence AI agent provides instant answers, acting as your personal data analytics assistant. Query sales, inventory, CRM, and more via natural language – information is just a prompt away. Get AI analytics and dashboard like clarity without complex tools like Power BI or Tableau. Your Odoo AI for direct data exploration using your OpenAI key (future compatible with models like Gemini via API). Get real time insights.
    """,
    'author': "Niyu Labs",
    'website': "https://niyulabs.com",
    'category': 'Productivity',
      'version': '18.0.1.0.0',
    'license': 'OPL-1',
    'price': 299,
    'currency': 'USD',
    'depends': ['base','web'],
    # 'images': ['static/description/banner.gif'],
    'data': [
        'views/assets.xml',
        'views/res_config_settings_views.xml',
        'views/niyu_ai_menu.xml',
        # 'views/niyu_ai_view.xml',
    ],
    'qweb': [
        'static/src/xml/niyu_ai_view.xml',
        'static/src/css/niyu_index.css',
    ],
    'installable': True,
    'application': True,
}

