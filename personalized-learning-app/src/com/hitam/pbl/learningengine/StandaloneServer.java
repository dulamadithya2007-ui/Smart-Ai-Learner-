package com.hitam.pbl.learningengine;

import com.hitam.pbl.learningengine.dto.*;
import com.hitam.pbl.learningengine.service.LearningEngineService;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Executors;

/**
 * Standalone High-Performance Web Server for the Personalized Learning App.
 * Zero external dependencies: runs with standard JDK (javac & java).
 */
public class StandaloneServer {

    private static final LearningEngineService service = new LearningEngineService();

    public static void main(String[] args) throws IOException {
        int port = 8080;
        if (args.length > 0) {
            try {
                port = Integer.parseInt(args[0]);
            } catch (NumberFormatException ignored) {}
        }

        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.setExecutor(Executors.newFixedThreadPool(8));

        // REST API Contexts
        server.createContext("/api/assessment", new AssessmentHandler());
        server.createContext("/api/quiz/submit", new QuizSubmitHandler());
        server.createContext("/api/analytics", new AnalyticsHandler());
        server.createContext("/api/feedback", new FeedbackHandler());

        // Static Web Context
        String webDir = "web";
        if (!new File(webDir).exists()) {
            File alt = new File("C:\\Users\\dulam\\.gemini\\antigravity\\scratch\\personalized-learning-app\\web");
            if (alt.exists()) webDir = alt.getAbsolutePath();
        }
        server.createContext("/", new StaticFileHandler(webDir));

        server.start();

        System.out.println("===============================================================");
        System.out.println(" 🧠 SMARTLEARN AI - PERSONALIZED LEARNING ENGINE RUNNING");
        System.out.println(" URL: http://localhost:" + port);
        System.out.println(" Open your browser to explore the VARK Adaptive Dashboard.");
        System.out.println(" Press Ctrl+C to terminate.");
        System.out.println("===============================================================");
    }

    private static class AssessmentHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendCors(exchange);
                return;
            }
            Map<String, String> body = parseJson(readRequestBody(exchange));
            AssessmentRequest req = new AssessmentRequest(
                    body.getOrDefault("name", "Student"),
                    body.getOrDefault("subject", "General"),
                    body.getOrDefault("weakTopic", "General Topic"),
                    Integer.parseInt(body.getOrDefault("concentrationSpan", "25")),
                    body.getOrDefault("varkQ1", "Visual"),
                    body.getOrDefault("varkQ2", "Visual")
            );

            StudyPlanResponse plan = service.calculateStudyPlan(req);

            StringBuilder sb = new StringBuilder("{");
            sb.append("\"topic\":\"").append(escape(plan.getTopic())).append("\",");
            sb.append("\"subject\":\"").append(escape(plan.getSubject())).append("\",");
            sb.append("\"dominantStyle\":\"").append(escape(plan.getDominantStyle())).append("\",");
            sb.append("\"focusMinutes\":").append(plan.getFocusMinutes()).append(",");
            sb.append("\"restMinutes\":").append(plan.getRestMinutes()).append(",");
            sb.append("\"strategies\":[");
            for (int i = 0; i < plan.getStrategies().size(); i++) {
                sb.append("\"").append(escape(plan.getStrategies().get(i))).append("\"");
                if (i < plan.getStrategies().size() - 1) sb.append(",");
            }
            sb.append("],");
            sb.append("\"varkScores\":{");
            int j = 0;
            for (Map.Entry<String, Integer> e : plan.getVarkScores().entrySet()) {
                sb.append("\"").append(e.getKey()).append("\":").append(e.getValue());
                if (++j < plan.getVarkScores().size()) sb.append(",");
            }
            sb.append("}}");

            sendJsonResponse(exchange, 200, sb.toString());
        }
    }

    private static class QuizSubmitHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendCors(exchange);
                return;
            }
            Map<String, String> body = parseJson(readRequestBody(exchange));
            QuizSubmissionRequest req = new QuizSubmissionRequest(
                    body.get("q1"),
                    body.get("q2")
            );
            AnalyticsResponse analytics = service.evaluateQuiz(req);
            sendAnalyticsJson(exchange, analytics);
        }
    }

    private static class AnalyticsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendCors(exchange);
                return;
            }
            AnalyticsResponse analytics = service.getAnalyticsData();
            sendAnalyticsJson(exchange, analytics);
        }
    }

    private static class FeedbackHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendCors(exchange);
                return;
            }
            Map<String, String> body = parseJson(readRequestBody(exchange));
            service.saveFeedback(new FeedbackRequest(
                    body.get("studentName"),
                    Integer.parseInt(body.getOrDefault("rating", "5")),
                    body.get("comments")
            ));
            sendJsonResponse(exchange, 201, "{\"message\":\"Feedback recorded\"}");
        }
    }

    private static void sendAnalyticsJson(HttpExchange exchange, AnalyticsResponse a) throws IOException {
        StringBuilder sb = new StringBuilder("{");
        sb.append("\"latestScore\":").append(a.getLatestScore()).append(",");
        sb.append("\"totalAttempts\":").append(a.getTotalAttempts()).append(",");
        sb.append("\"averageScore\":").append(a.getAverageScore()).append(",");
        sb.append("\"history\":[");
        for (int i = 0; i < a.getHistory().size(); i++) {
            QuizAttemptRecord r = a.getHistory().get(i);
            sb.append("{\"time\":\"").append(escape(r.getTime())).append("\",\"score\":").append(r.getScore()).append("}");
            if (i < a.getHistory().size() - 1) sb.append(",");
        }
        sb.append("]}");
        sendJsonResponse(exchange, 200, sb.toString());
    }

    private static class StaticFileHandler implements HttpHandler {
        private final String rootDir;

        public StaticFileHandler(String rootDir) {
            this.rootDir = rootDir;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            if (path == null || path.equals("/") || path.isEmpty()) {
                path = "/index.html";
            }

            Path file = Paths.get(rootDir, path.replace("/", File.separator)).normalize();
            Path base = Paths.get(rootDir).toAbsolutePath().normalize();

            if (!file.toAbsolutePath().startsWith(base) || !Files.exists(file) || Files.isDirectory(file)) {
                String nf = "<h1>404 Not Found</h1>";
                exchange.getResponseHeaders().set("Content-Type", "text/html; charset=UTF-8");
                exchange.sendResponseHeaders(404, nf.length());
                exchange.getResponseBody().write(nf.getBytes(StandardCharsets.UTF_8));
                exchange.close();
                return;
            }

            String mime = "application/octet-stream";
            if (path.endsWith(".html")) mime = "text/html; charset=UTF-8";
            else if (path.endsWith(".css")) mime = "text/css";
            else if (path.endsWith(".js")) mime = "application/javascript";
            else if (path.endsWith(".json")) mime = "application/json";

            byte[] b = Files.readAllBytes(file);
            exchange.getResponseHeaders().set("Content-Type", mime);
            exchange.sendResponseHeaders(200, b.length);
            exchange.getResponseBody().write(b);
            exchange.close();
        }
    }

    private static void sendCors(HttpExchange ex) throws IOException {
        ex.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        ex.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        ex.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
        ex.sendResponseHeaders(204, -1);
        ex.close();
    }

    private static void sendJsonResponse(HttpExchange ex, int code, String json) throws IOException {
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        ex.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        ex.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        ex.sendResponseHeaders(code, bytes.length);
        ex.getResponseBody().write(bytes);
        ex.close();
    }

    private static String readRequestBody(HttpExchange ex) throws IOException {
        try (BufferedReader r = new BufferedReader(new InputStreamReader(ex.getRequestBody(), StandardCharsets.UTF_8))) {
            StringBuilder sb = new StringBuilder();
            String l;
            while ((l = r.readLine()) != null) sb.append(l);
            return sb.toString();
        }
    }

    private static Map<String, String> parseJson(String json) {
        Map<String, String> map = new HashMap<>();
        if (json == null || json.trim().isEmpty()) return map;
        String s = json.trim();
        if (s.startsWith("{") && s.endsWith("}")) s = s.substring(1, s.length() - 1);
        String[] pairs = s.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
        for (String p : pairs) {
            String[] kv = p.split(":(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");
            if (kv.length == 2) {
                map.put(kv[0].trim().replaceAll("^\"|\"$", ""), kv[1].trim().replaceAll("^\"|\"$", ""));
            }
        }
        return map;
    }

    private static String escape(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }
}
